import Link from "next/link";
import { notFound } from "next/navigation";
import { requireCustomer } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { submitMockPayment } from "./actions";

export const metadata = { title: "درگاه پرداخت آزمایشی" };

export default async function MockPaymentPage({ searchParams }: { searchParams: Promise<{ authority?: string }> }) {
  const user = await requireCustomer();
  const { authority } = await searchParams;
  if (!authority || (process.env.PAYMENT_PROVIDER ?? "mock") !== "mock") notFound();
  const payment = await prisma.payment.findFirst({ where: { authority, provider: "mock", order: { userId: user.id } }, include: { order: true } });
  if (!payment) notFound();
  const isPending = payment.status === "PENDING" && payment.order.status === "PENDING" && !payment.referenceId;

  return <div className="container flex min-h-[65vh] items-center justify-center py-12">
    <Card className="w-full max-w-lg space-y-6 p-6 md:p-8">
      <div><p className="text-sm font-bold text-primary">رادمان · محیط آزمایشی</p><h1 className="mt-3 text-2xl font-bold">درگاه پرداخت ماک</h1></div>
      <p className="text-sm leading-7 text-muted-foreground">هیچ پولی جابه‌جا نمی‌شود و نیازی به اطلاعات کارت بانکی نیست. نتیجهٔ پرداخت را برای تست انتخاب کنید.</p>
      <dl className="space-y-3 rounded-xl border p-4 text-sm">
        <div className="flex justify-between gap-3"><dt>پذیرنده</dt><dd>فروشگاه رادمان</dd></div>
        <div className="flex justify-between gap-3"><dt>مبلغ پرداخت</dt><dd className="font-bold">{formatPrice(payment.amount)}</dd></div>
        <div><dt>شماره سفارش</dt><dd className="mt-2 break-all" dir="ltr">{payment.orderId}</dd></div>
      </dl>
      {isPending ? <form action={submitMockPayment} className="grid gap-3">
        <input type="hidden" name="authority" value={authority} />
        <Button name="outcome" value="success" type="submit">شبیه‌سازی پرداخت موفق</Button>
        <Button name="outcome" value="failure" type="submit" variant="outline">شبیه‌سازی پرداخت ناموفق</Button>
        <Button name="outcome" value="cancel" type="submit" variant="ghost">انصراف و بازگشت به فروشگاه</Button>
      </form> : <Button asChild className="w-full"><Link href={`/checkout/result?authority=${encodeURIComponent(authority)}`}>مشاهده نتیجهٔ پرداخت</Link></Button>}
    </Card>
  </div>;
}
