import Link from "next/link";
import { registerCustomer } from "@/app/account/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type RegisterPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AccountRegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams;
  const errorMessage =
    params.error === "exists"
      ? "این ایمیل قبلاً ثبت شده است."
      : params.error
        ? "اطلاعات واردشده معتبر نیست."
        : null;

  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-12">
      <Card className="w-full max-w-md p-6 shadow-water">
        <h1 className="text-2xl font-black text-sky-950">ثبت‌نام</h1>
        {errorMessage ? <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-destructive">{errorMessage}</p> : null}
        <form action={registerCustomer} className="mt-6 space-y-4">
          <Input name="name" placeholder="نام و نام خانوادگی" required />
          <Input name="email" type="email" placeholder="ایمیل" required dir="ltr" />
          <Input name="phone" placeholder="شماره تماس" required inputMode="tel" />
          <Input name="password" type="password" placeholder="رمز عبور (حداقل ۶ کاراکتر)" required dir="ltr" />
          <Button className="w-full">ثبت‌نام</Button>
        </form>
        <p className="mt-4 text-sm text-muted-foreground">
          قبلاً ثبت‌نام کرده‌اید؟{" "}
          <Link href="/account/login" className="font-semibold text-primary">
            ورود
          </Link>
        </p>
      </Card>
    </div>
  );
}
