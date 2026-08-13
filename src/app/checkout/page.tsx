import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { getCurrentUser } from "@/lib/auth/session";
import { getActiveShippingMethods } from "@/app/shop/actions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "تسویه حساب"
};

export default async function CheckoutPage() {
  const [shippingMethods, user] = await Promise.all([getActiveShippingMethods(), getCurrentUser()]);

  if (user?.role !== "CUSTOMER") {
    redirect("/account/login?next=/checkout");
  }

  const defaultAddress = await prisma.address.findFirst({
    where: { userId: user.id },
    orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }]
  });

  return (
    <CheckoutForm
      shippingMethods={shippingMethods}
      defaultValues={
        {
          customerName: defaultAddress?.recipient ?? user.name,
          customerPhone: defaultAddress?.phone ?? user.phone ?? "",
          customerEmail: "",
          postalCode: defaultAddress?.postalCode ?? "",
          address: defaultAddress ? `${defaultAddress.province}، ${defaultAddress.city}، ${defaultAddress.address}${defaultAddress.plaque ? `، پلاک ${defaultAddress.plaque}` : ""}${defaultAddress.unit ? `، واحد ${defaultAddress.unit}` : ""}` : ""
        }
      }
    />
  );
}
