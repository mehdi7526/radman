import { Card } from "@/components/ui/card";
import { OtpLoginForm } from "@/components/auth/otp-login-form";

type LoginPageProps = {
  searchParams: Promise<{ error?: string; next?: string }>;
};

export default async function AccountLoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-12">
      <Card className="w-full max-w-md p-8 shadow-water md:p-10">
        <h1 className="text-2xl font-black text-sky-950">ورود به حساب</h1>
        <div className="mt-6"><OtpLoginForm next={params.next} /></div>
        <p className="mt-6 text-center text-xs leading-6 text-muted-foreground">با تأیید شماره موبایل، حساب کاربری شما به‌صورت خودکار ایجاد می‌شود.</p>
      </Card>
    </div>
  );
}
