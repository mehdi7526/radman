import type { Metadata } from "next";
import { loginAdmin } from "@/app/admin/actions";
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
    <div className="container flex min-h-[70vh] items-center justify-center py-12">
      <Card className="w-full max-w-md p-6 shadow-water">
        <h1 className="text-2xl font-black text-sky-950">ورود به ادمین رادمان</h1>
        <p className="mt-2 text-sm text-muted-foreground">اطلاعات پیش‌فرض در `.env.example` آمده است.</p>
        {params.error ? <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-destructive">ایمیل یا رمز اشتباه است.</p> : null}
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
