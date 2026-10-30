import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

async function main() {
  const directory = mkdtempSync(path.join(tmpdir(), "radman-checkout-"));
  process.env.DATABASE_URL = `file:${path.join(directory, "test.db").replaceAll("\\", "/")}`;
  process.env.PAYMENT_PROVIDER = "mock";
  const { prisma } = await import("../src/lib/db");
  const { getPaymentProvider, chooseMockPaymentOutcome } = await import("../src/lib/payment/provider");
  const { finalizeCheckout } = await import("../src/lib/payment/checkout");
  const { changeOrderStatus } = await import("../src/lib/orders");
  try {
    execFileSync(process.execPath, ["--import", "tsx", "prisma/init-db.ts"], { env: process.env, stdio: "pipe" });
    const user = await prisma.user.create({ data: { name: "Test", email: "test@radman.local", phone: "09000000001", passwordHash: "unused" } });
    const other = await prisma.user.create({ data: { name: "Other", email: "other@radman.local", phone: user.phone, passwordHash: "unused" } });
    const product = await prisma.product.create({ data: { name: "Test product", slug: "test", shortDescription: "Test product", description: "Test product", price: 1000, inventory: 5, isPublished: true } });
    const inventory = async () => (await prisma.product.findUniqueOrThrow({ where: { id: product.id } })).inventory;
    const provider = getPaymentProvider();
    async function checkout(quantity = 1) {
      const order = await prisma.order.create({ data: { userId: user.id, customerName: "Test", customerPhone: user.phone!, address: "Test address", postalCode: "1234567890", subtotal: 1000 * quantity, total: 1000 * quantity, items: { create: { productId: product.id, quantity, unitPrice: 1000 } } } });
      const payment = await provider.createPayment({ orderId: order.id, amount: order.total, callbackUrl: "http://localhost:3000/checkout/result" });
      await prisma.payment.create({ data: { orderId: order.id, amount: order.total, ...payment } });
      assert.ok(payment.redirectUrl.startsWith("/checkout/mock?authority="));
      return { order, authority: payment.authority };
    }
    const paid = await checkout();
    assert.equal((await finalizeCheckout(paid.authority, user.id))?.pending, true);
    assert.equal(await inventory(), 5, "opening a callback must not complete an undecided payment");
    assert.equal(await finalizeCheckout(paid.authority, other.id), null, "other accounts cannot view/finalize a payment even with the same phone");
    await chooseMockPaymentOutcome(paid.authority, other.id, "success");
    assert.equal(await provider.getPaymentStatus(paid.authority), "PENDING");
    await chooseMockPaymentOutcome(paid.authority, user.id, "success");
    assert.equal((await finalizeCheckout(paid.authority, user.id))?.ok, true);
    assert.equal(await inventory(), 4);
    assert.equal((await finalizeCheckout(paid.authority, user.id))?.alreadyVerified, true);
    assert.equal(await inventory(), 4, "repeated callbacks must not decrement twice");
    assert.equal((await prisma.$transaction(tx => changeOrderStatus(tx, paid.order.id, "CANCELLED"))).ok, true);
    assert.equal(await inventory(), 5, "cancellation restores paid stock");
    await prisma.$transaction(tx => changeOrderStatus(tx, paid.order.id, "CANCELLED"));
    assert.equal(await inventory(), 5, "repeated cancellation must not add extra stock");
    assert.equal((await prisma.$transaction(tx => changeOrderStatus(tx, paid.order.id, "PAID"))).ok, false);
    assert.equal((await finalizeCheckout(paid.authority, user.id))?.ok, false, "old callback cannot reactivate cancelled order");
    for (const outcome of ["failure", "cancel"] as const) {
      const attempt = await checkout();
      await chooseMockPaymentOutcome(attempt.authority, user.id, outcome);
      await chooseMockPaymentOutcome(attempt.authority, user.id, "success");
      assert.equal((await finalizeCheckout(attempt.authority, user.id))?.ok, false, "first gateway choice wins");
      assert.equal(await inventory(), 5);
      assert.equal((await prisma.order.findUniqueOrThrow({ where: { id: attempt.order.id } })).status, "CANCELLED");
    }
    const pending = await checkout();
    await prisma.$transaction(tx => changeOrderStatus(tx, pending.order.id, "CANCELLED"));
    await chooseMockPaymentOutcome(pending.authority, user.id, "success");
    assert.equal((await finalizeCheckout(pending.authority, user.id))?.ok, false);
    assert.equal(await inventory(), 5, "unpaid cancellation must not increase stock");
    const soldOut = await checkout(6);
    await chooseMockPaymentOutcome(soldOut.authority, user.id, "success");
    assert.equal((await finalizeCheckout(soldOut.authority, user.id))?.ok, false);
    assert.equal(await inventory(), 5, "inventory conflict must leave stock untouched");
    assert.equal(await finalizeCheckout("missing-authority", user.id), null);
    console.log("PASS: mock success/failure/cancel, undecided and repeated callbacks, ownership, paid/unpaid cancellation, repeated cancellation, terminal cancellation, and insufficient stock.");
  } finally {
    await prisma.$disconnect();
    assert.equal(path.dirname(path.resolve(directory)), path.resolve(tmpdir()));
    assert.ok(path.basename(directory).startsWith("radman-checkout-"));
    rmSync(directory, { recursive: true, force: true });
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
