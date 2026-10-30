"use server";

import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { requireCustomer } from "@/lib/auth/session";
import { chooseMockPaymentOutcome } from "@/lib/payment/provider";
import { verifyCheckout } from "@/app/checkout/actions";

export async function submitMockPayment(formData: FormData) {
  const user = await requireCustomer();
  const authority = z.string().min(1).parse(formData.get("authority"));
  const outcome = z.enum(["success", "failure", "cancel"]).parse(formData.get("outcome"));
  await chooseMockPaymentOutcome(authority, user.id, outcome);
  const result = await verifyCheckout(authority);
  if (result?.ok) {
    revalidateTag("products");
    revalidatePath("/account");
    revalidatePath("/admin");
  }
  redirect(`/checkout/result?authority=${encodeURIComponent(authority)}`);
}
