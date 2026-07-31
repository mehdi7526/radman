import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { getCurrentUser } from "@/lib/auth/session";
import { getActiveShippingMethods } from "@/app/shop/actions";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "تسویه حساب"
};

export default async function CheckoutPage() {
  const [shippingMethods, user] = await Promise.all([getActiveShippingMethods(), getCurrentUser()]);

  if (user?.role !== "CUSTOMER") {
    redirect("/account/login?next=/checkout");
  }

  return (
    <CheckoutForm
      shippingMethods={shippingMethods}
      defaultValues={
        { customerName: user.name, customerPhone: user.phone ?? "", customerEmail: "" }
      }
    />
  );
}
