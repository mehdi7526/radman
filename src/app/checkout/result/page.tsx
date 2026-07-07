import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { verifyCheckout } from "@/app/checkout/actions";
import { ClearCartOnSuccess } from "@/components/checkout/clear-cart-on-success";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";

type ResultPageProps = {
  searchParams: Promise<{ authority?: string }>;
};

export default async function CheckoutResultPage({ searchParams }: ResultPageProps) {
  const params = await searchParams;
  const result = await verifyCheckout(params.authority ?? null);

  return (
    <div className="container flex min-h-[60vh] items-center justify-center py-12">
      <ClearCartOnSuccess shouldClear={Boolean(result?.ok)} />
      <Card className="max-w-xl p-8 text-center">
        {result?.ok ? (
          <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-500" />
        ) : (
          <XCircle className="mx-auto h-16 w-16 text-destructive" />
        )}
        <h1 className="mt-5 text-3xl font-black text-sky-950">
          {result?.ok ? "سفارش با موفقیت ثبت شد" : "پرداخت ناموفق بود"}
        </h1>
        {result?.ok ? (
          <p className="mt-4 leading-8 text-muted-foreground">
            شماره سفارش: {result.orderId}
            <br />
            مبلغ: {formatPrice(result.amount)}
            <br />
            کد پیگیری: {result.referenceId}
          </p>
        ) : (
          <p className="mt-4 text-muted-foreground">
            {result && "error" in result && typeof result.error === "string"
              ? result.error
              : "امکان تایید پرداخت وجود نداشت."}
          </p>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {result?.ok ? (
            <>
              <Button asChild variant="outline">
                <Link href={`/track?id=${result.orderId}`}>پیگیری سفارش</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={`/account/orders/${result.orderId}`}>حساب کاربری</Link>
              </Button>
            </>
          ) : null}
          <Button asChild>
            <Link href="/products">بازگشت به محصولات</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
