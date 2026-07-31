import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSession } from "@/lib/auth/session";
import { verifyDevelopmentOtp } from "@/lib/auth/otp";
import { hashPassword } from "@/lib/auth/password";

export async function POST(request: Request) {
  const { phone, code } = await request.json();
  const normalizedPhone = String(phone ?? "").trim();
  const submittedCode = String(code ?? "").trim();
  const isDevelopmentCode = process.env.NODE_ENV !== "production" && submittedCode === (process.env.DEV_OTP_CODE ?? "11111");
  if (!isDevelopmentCode && !verifyDevelopmentOtp(normalizedPhone, submittedCode)) return NextResponse.json({ error: "کد ورود نامعتبر یا منقضی شده است." }, { status: 400 });
  let user = await prisma.user.findFirst({ where: { phone: normalizedPhone, role: "CUSTOMER" } });
  if (!user) {
    const phoneKey = normalizedPhone.replace(/\D/g, "") || "customer";
    user = await prisma.user.create({
      data: {
        name: "کاربر رادمان",
        phone: normalizedPhone,
        email: `otp-${phoneKey}@radman.local`,
        passwordHash: hashPassword(crypto.randomUUID()),
        role: "CUSTOMER"
      }
    });
  }
  const token = await createSession(user.id, "CUSTOMER");
  return NextResponse.json({ ok: true, token, user: { id: user.id, name: user.name, phone: user.phone } });
}
