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
  verifyPayment(authority: string): Promise<{ ok: boolean; referenceId?: string }>;
  getPaymentStatus(authority: string): Promise<"PENDING" | "SUCCEEDED" | "FAILED">;
};

const mockProvider: PaymentProvider = {
  async createPayment(input) {
    const authority = `mock-${input.orderId}`;

    return {
      provider: "mock",
      authority,
      redirectUrl: `/checkout/result?authority=${authority}&status=ok`
    };
  },
  async verifyPayment(authority) {
    return {
      ok: authority.startsWith("mock-"),
      referenceId: authority.replace("mock-", "RAD-")
    };
  },
  async getPaymentStatus(authority) {
    return authority.startsWith("mock-") ? "SUCCEEDED" : "FAILED";
  }
};

export function getPaymentProvider(): PaymentProvider {
  const provider = process.env.PAYMENT_PROVIDER ?? "mock";
  if (provider === "mock") {
    return mockProvider;
  }

  return mockProvider;
}
