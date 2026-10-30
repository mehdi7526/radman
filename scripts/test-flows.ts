/**
 * End-to-end flow smoke tests for radman-shop.
 * Run: npx tsx scripts/test-flows.ts
 */

import { PrismaClient } from "@prisma/client";
import { hashPassword, verifyPassword } from "../src/lib/auth/password";
import { validateCoupon } from "../src/lib/coupon";
import { getPaymentProvider, chooseMockPaymentOutcome } from "../src/lib/payment/provider";
import { finalizeCheckout } from "../src/lib/payment/checkout";
import { changeOrderStatus } from "../src/lib/orders";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const prisma = new PrismaClient();

type Result = { name: string; ok: boolean; detail?: string };

const results: Result[] = [];

function pass(name: string, detail?: string) {
  results.push({ name, ok: true, detail });
  console.log(`✓ ${name}${detail ? ` — ${detail}` : ""}`);
}

function fail(name: string, detail?: string) {
  results.push({ name, ok: false, detail });
  console.error(`✗ ${name}${detail ? ` — ${detail}` : ""}`);
}

async function checkPage(path: string, expectedStatus = 200) {
  const res = await fetch(`${BASE}${path}`, { redirect: "manual" });
  const ok = res.status === expectedStatus;
  if (ok) {
    pass(`GET ${path}`, String(res.status));
  } else {
    fail(`GET ${path}`, `expected ${expectedStatus}, got ${res.status}`);
  }
  return res;
}

async function checkRedirect(path: string, expectedLocationPart: string) {
  const res = await fetch(`${BASE}${path}`, { redirect: "manual" });
  const location = res.headers.get("location") ?? "";
  const ok = (res.status === 307 || res.status === 302) && location.includes(expectedLocationPart);
  if (ok) {
    pass(`GET ${path} → redirect`, location);
  } else {
    fail(`GET ${path} → redirect`, `status=${res.status} location=${location}`);
  }
}

async function testPages() {
  console.log("\n--- Pages ---");
  await checkPage("/");
  await checkPage("/products");
  await checkPage("/cart");
  await checkPage("/checkout");
  await checkPage("/track");
  await checkPage("/account/login");
  await checkPage("/account/register");
  await checkPage("/admin/login");

  const product = await prisma.product.findFirst({ where: { isPublished: true } });
  if (product) {
    await checkPage(`/products/${product.slug}`);
  } else {
    fail("GET /products/[slug]", "no published product");
  }

  await checkRedirect("/admin", "/admin/login");
  await checkRedirect("/account", "/account/login");
}

async function testSeedData() {
  console.log("\n--- Seed data ---");

  const [products, categories, shipping, coupon, admin] = await Promise.all([
    prisma.product.count({ where: { isPublished: true } }),
    prisma.category.count(),
    prisma.shippingMethod.count({ where: { isActive: true } }),
    prisma.coupon.findUnique({ where: { code: "RADMAN10" } }),
    prisma.user.findUnique({ where: { email: "admin@radman.local" } })
  ]);

  products > 0 ? pass("Published products", String(products)) : fail("Published products", "0");
  categories > 0 ? pass("Categories", String(categories)) : fail("Categories", "0");
  shipping > 0 ? pass("Shipping methods", String(shipping)) : fail("Shipping methods", "0");
  coupon ? pass("Coupon RADMAN10") : fail("Coupon RADMAN10", "missing");
  admin?.role === "ADMIN" ? pass("Admin user") : fail("Admin user", admin?.role ?? "missing");
}

async function testAuth() {
  console.log("\n--- Auth ---");

  const hash = hashPassword("test-password-123");
  verifyPassword("test-password-123", hash) ? pass("bcrypt hash/verify") : fail("bcrypt hash/verify");

  const admin = await prisma.user.findUnique({ where: { email: "admin@radman.local" } });
  if (admin && verifyPassword("radman-admin-123", admin.passwordHash)) {
    pass("Admin password verify");
  } else {
    fail("Admin password verify");
  }
}

async function testCouponLogic() {
  console.log("\n--- Coupon ---");

  const coupon = await prisma.coupon.findUnique({ where: { code: "RADMAN10" } });
  if (!coupon) {
    fail("Coupon validation", "RADMAN10 not found");
    return;
  }

  const valid = validateCoupon(coupon, 10_000_000);
  valid.ok ? pass("Coupon valid for 10M order", `discount=${valid.discount}`) : fail("Coupon valid for 10M order", valid.error);

  const invalid = validateCoupon(coupon, 1_000_000);
  !invalid.ok ? pass("Coupon rejected for low order") : fail("Coupon rejected for low order");
}

async function testCheckoutFlow() {
  console.log("\n--- Checkout flow ---");
  const product = await prisma.product.findFirst({ where: { isPublished: true, inventory: { gt: 0 } } });
  if (!product) { fail("Checkout setup", "no available product"); return; }
  const user = await prisma.user.create({ data: { name: "Flow test", email: `flow-${Date.now()}@radman.local`, passwordHash: hashPassword("test-only") } });
  let orderId: string | undefined;
  try {
    const order = await prisma.order.create({ data: {
      userId: user.id, customerName: "Flow test", customerPhone: "09000000000",
      postalCode: "1234567890", address: "Local flow test address", subtotal: product.price, total: product.price,
      items: { create: { productId: product.id, quantity: 1, unitPrice: product.price } }
    } });
    orderId = order.id;
    const payment = await getPaymentProvider().createPayment({ orderId: order.id, amount: order.total, callbackUrl: `${BASE}/checkout/result` });
    await prisma.payment.create({ data: { orderId: order.id, amount: order.total, ...payment } });
    const pending = await finalizeCheckout(payment.authority, user.id);
    pending?.pending ? pass("Payment awaits gateway decision") : fail("Payment awaits gateway decision");
    await chooseMockPaymentOutcome(payment.authority, user.id, "success");
    const paid = await finalizeCheckout(payment.authority, user.id);
    paid?.ok ? pass("Actual payment finalization") : fail("Actual payment finalization");
    const afterPayment = await prisma.product.findUniqueOrThrow({ where: { id: product.id } });
    afterPayment.inventory === product.inventory - 1 ? pass("Inventory decremented") : fail("Inventory decremented");
    await prisma.$transaction(tx => changeOrderStatus(tx, order.id, "CANCELLED"));
    const restored = await prisma.product.findUniqueOrThrow({ where: { id: product.id } });
    restored.inventory === product.inventory ? pass("Cancellation restores stock") : fail("Cancellation restores stock");
  } finally {
    if (orderId) {
      await prisma.$transaction(tx => changeOrderStatus(tx, orderId!, "CANCELLED"));
      await cleanup(orderId);
    }
    await prisma.user.delete({ where: { id: user.id } });
    pass("Test data cleaned up");
  }
}

async function cleanup(orderId: string) {
  await prisma.payment.deleteMany({ where: { orderId } });
  await prisma.orderItem.deleteMany({ where: { orderId } });
  await prisma.order.delete({ where: { id: orderId } });
}

async function testCustomerRegistration() {
  console.log("\n--- Customer registration ---");

  const email = `test-${Date.now()}@radman.local`;
  const user = await prisma.user.create({
    data: {
      email,
      name: "مشتری تست",
      phone: "09121111111",
      passwordHash: hashPassword("customer-test-123"),
      role: "CUSTOMER"
    }
  });
  pass("Customer created", email);

  verifyPassword("customer-test-123", user.passwordHash) ? pass("Customer password") : fail("Customer password");

  await prisma.user.delete({ where: { id: user.id } });
  pass("Customer cleaned up");
}

async function main() {
  console.log(`Testing radman-shop at ${BASE}\n`);

  try {
    await testPages();
    await testSeedData();
    await testAuth();
    await testCouponLogic();
    await testCheckoutFlow();
    await testCustomerRegistration();
  } catch (error) {
    fail("Unexpected error", error instanceof Error ? error.message : String(error));
  } finally {
    await prisma.$disconnect();
  }

  const failed = results.filter((r) => !r.ok);
  console.log(`\n=== ${results.length - failed.length}/${results.length} passed ===`);
  if (failed.length > 0) {
    console.log("\nFailed:");
    failed.forEach((r) => console.log(`  - ${r.name}: ${r.detail ?? ""}`));
    process.exit(1);
  }
}

main();
