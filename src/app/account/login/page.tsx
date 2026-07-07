import Link from "next/link";
import { loginCustomer, logoutCustomer, registerCustomer } from "@/app/account/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AccountLoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-12">
      <Card className="w-full max-w-md p-6 shadow-water">
        <h1 className="text-2xl font-black text-sky-950">ورود به حساب</h1>
        {params.error ? <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-destructive">ایمیل یا رمز اشتباه است.</p> : null}
        <form action={loginCustomer} className="mt-6 space-y-4">
          <Input name="email" type="email" placeholder="ایمیل" required dir="ltr" />
          <Input name="password" type="password" placeholder="رمز عبور" required dir="ltr" />
          <Button className="w-full">ورود</Button>
        </form>
        <p className="mt-4 text-sm text-muted-foreground">
          حساب ندارید؟{" "}
          <Link href="/account/register" className="font-semibold text-primary">
            ثبت‌نام
          </Link>
        </p>
      </Card>
    </div>
  );
}
