import type { Metadata } from "next";
import { loginAdmin } from "@/app/admin/actions";
import { BrandDivider } from "@/components/brand/brand-divider";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";

export const metadata: Metadata = {
  title: "ورود ادمین"
};

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <div className="container flex min-h-[70dvh] items-center justify-center py-12">
      <Card className="w-full max-w-md p-6 shadow-subtle">
        <div className="flex flex-col items-center text-center">
          <Logo size="lg" showText={false} />
          <h1 className="mt-4 text-balance text-2xl font-bold text-foreground">ورود به پنل مدیریت</h1>
        </div>
        <BrandDivider className="my-6" />
        <p className="text-pretty text-sm text-muted-foreground">اطلاعات پیش‌فرض در `.env.example` آمده است.</p>
        {params.error ? (
          <p className="mt-4 border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive" role="alert">
            ایمیل یا رمز اشتباه است.
          </p>
        ) : null}
        <form action={loginAdmin} className="mt-6 space-y-4">
          <label className="space-y-2 text-sm font-medium">
            ایمیل
            <Input name="email" type="email" required defaultValue="admin@radman.local" dir="ltr" />
          </label>
          <label className="space-y-2 text-sm font-medium">
            رمز عبور
            <PasswordInput name="password" required defaultValue="radman-admin-123" dir="ltr" />
          </label>
          <Button className="w-full">ورود</Button>
        </form>
      </Card>
    </div>
  );
}
