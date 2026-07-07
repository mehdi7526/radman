import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { getCurrentUser } from "@/lib/auth/session";
import { getActiveShippingMethods } from "@/app/shop/actions";

export const metadata: Metadata = {
  title: "تسویه حساب"
};

export default async function CheckoutPage() {
  const [shippingMethods, user] = await Promise.all([getActiveShippingMethods(), getCurrentUser()]);

  return (
    <CheckoutForm
      shippingMethods={shippingMethods}
      defaultValues={
        user?.role === "CUSTOMER"
          ? {
              customerName: user.name,
              customerPhone: user.phone ?? "",
              customerEmail: user.email
            }
          : undefined
      }
    />
  );
}
