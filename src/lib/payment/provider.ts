import { randomUUID } from "crypto";
import { prisma } from "@/lib/db";

export type CreatePaymentInput = {
  orderId: string;
  amount: number;
  callbackUrl: string;
};

export type PaymentResult = {
  provider: string;
  authority: string;
  redirectUrl: string;
};

export type PaymentProvider = {
  createPayment(input: CreatePaymentInput): Promise<PaymentResult>;
  verifyPayment(authority: string): Promise<{ ok: boolean; pending?: boolean; referenceId?: string }>;
  getPaymentStatus(authority: string): Promise<"PENDING" | "SUCCEEDED" | "FAILED">;
};

const mockProvider: PaymentProvider = {
  async createPayment() {
    const authority = `mock-${randomUUID()}`;

    return {
      provider: "mock",
      authority,
      redirectUrl: `/checkout/mock?authority=${encodeURIComponent(authority)}`
    };
  },
  async verifyPayment(authority) {
    const payment = await prisma.payment.findFirst({ where: { authority, provider: "mock" } });
    if (!payment || payment.status === "FAILED") return { ok: false };
    if (!payment.referenceId) return { ok: false, pending: true };
    return { ok: payment.referenceId.startsWith("RAD-"), referenceId: payment.referenceId };
  },
  async getPaymentStatus(authority) {
    const result = await this.verifyPayment(authority);
    return result.pending ? "PENDING" : result.ok ? "SUCCEEDED" : "FAILED";
  }
};

export function getPaymentProvider(): PaymentProvider {
  const provider = process.env.PAYMENT_PROVIDER ?? "mock";
  if (provider === "mock") {
    return mockProvider;
  }

  throw new Error(`Unsupported payment provider: ${provider}`);
}

export async function chooseMockPaymentOutcome(authority: string, userId: string, outcome: "success" | "failure" | "cancel") {
  if ((process.env.PAYMENT_PROVIDER ?? "mock") !== "mock") throw new Error("Mock payments are disabled");
  // The first gateway decision wins, including when the browser submits twice.
  await prisma.payment.updateMany({
    where: { authority, provider: "mock", status: "PENDING", referenceId: null, order: { userId, status: "PENDING" } },
    data: { referenceId: `${outcome === "success" ? "RAD" : "FAIL"}-${randomUUID()}` }
  });
}
