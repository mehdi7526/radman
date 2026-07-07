/**
 * End-to-end flow smoke tests for radman-shop.
 * Run: npx tsx scripts/test-flows.ts
 */

import { PrismaClient } from "@prisma/client";
import { hashPassword, verifyPassword } from "../src/lib/auth/password";
import { validateCoupon } from "../src/lib/coupon";
import { getPaymentProvider } from "../src/lib/payment/provider";

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

  const product = await prisma.product.findFirst({
    where: { isPublished: true, inventory: { gt: 0 } }
  });
  const shipping = await prisma.shippingMethod.findFirst({ where: { isActive: true } });
  const coupon = await prisma.coupon.findUnique({ where: { code: "RADMAN10" } });

  if (!product || !shipping) {
    fail("Checkout setup", "missing product or shipping");
    return;
  }

  const subtotal = product.price;
  const couponResult = coupon ? validateCoupon(coupon, subtotal) : { ok: false as const, error: "no coupon" };
  const discount = couponResult.ok ? couponResult.discount : 0;
  const total = Math.max(0, subtotal - discount + shipping.price);

  const order = await prisma.order.create({
    data: {
      customerName: "تست خودکار",
      customerPhone: "09120000000",
      customerEmail: "test@radman.local",
      address: "تهران، خیابان تست، پلاک ۱",
      subtotal,
      discountAmount: discount,
      shippingCost: shipping.price,
      total,
      couponId: couponResult.ok ? coupon!.id : null,
      couponCode: couponResult.ok ? coupon!.code : null,
      shippingMethodId: shipping.id,
      items: {
        create: [{ productId: product.id, quantity: 1, unitPrice: product.price }]
      }
    },
    include: { items: true }
  });
  pass("Order created", order.id);

  const paymentProvider = getPaymentProvider();
  const paymentResult = await paymentProvider.createPayment({
    orderId: order.id,
    amount: total,
    callbackUrl: `${BASE}/checkout/result`
  });
  pass("Mock payment created", paymentResult.authority);

  const payment = await prisma.payment.create({
    data: {
      orderId: order.id,
      provider: paymentResult.provider,
      authority: paymentResult.authority,
      amount: total,
      redirectUrl: paymentResult.redirectUrl
    }
  });

  const verify = await paymentProvider.verifyPayment(payment.authority!);
  if (!verify.ok) {
    fail("Payment verify");
    await cleanup(order.id);
    return;
  }
  pass("Payment verified", verify.referenceId);

  await prisma.$transaction(async (tx) => {
    for (const item of order.items) {
      const updated = await tx.product.updateMany({
        where: { id: item.productId, inventory: { gte: item.quantity } },
        data: { inventory: { decrement: item.quantity } }
      });
      if (updated.count === 0) throw new Error("INVENTORY_CONFLICT");
    }
    await tx.payment.update({
      where: { id: payment.id },
      data: { status: "SUCCEEDED", referenceId: verify.referenceId }
    });
    await tx.order.update({
      where: { id: order.id },
      data: { status: "PAID" }
    });
    if (order.couponId) {
      await tx.coupon.update({
        where: { id: order.couponId },
        data: { usedCount: { increment: 1 } }
      });
    }
  });
  pass("Inventory decremented + order PAID");

  const updatedProduct = await prisma.product.findUnique({ where: { id: product.id } });
  if (updatedProduct && updatedProduct.inventory === product.inventory - 1) {
    pass("Inventory count correct", `${product.inventory} → ${updatedProduct.inventory}`);
  } else {
    fail("Inventory count correct", `expected ${product.inventory - 1}, got ${updatedProduct?.inventory}`);
  }

  await prisma.order.update({
    where: { id: order.id },
    data: { status: "SHIPPED", trackingCode: "TEST-TRACK-001" }
  });
  const tracked = await prisma.order.findFirst({
    where: { id: order.id, customerPhone: "09120000000" }
  });
  tracked?.trackingCode === "TEST-TRACK-001" ? pass("Order tracking update") : fail("Order tracking update");

  await checkPage(`/checkout/result?authority=${payment.authority}`, 200);

  await cleanup(order.id);
  pass("Test order cleaned up");
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
