import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata: Metadata = {
  title: "تسویه حساب"
};

export default function CheckoutPage() {
  return <CheckoutForm />;
}
