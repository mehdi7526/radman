import { NextResponse } from "next/server";
import { issueDevelopmentOtp } from "@/lib/auth/otp";

export async function POST(request: Request) {
  const { phone } = await request.json();
  const normalizedPhone = String(phone ?? "").trim();
  if (normalizedPhone.length < 8) return NextResponse.json({ error: "شماره موبایل معتبر نیست." }, { status: 400 });
  const expiresAt = issueDevelopmentOtp(normalizedPhone);
  return NextResponse.json({ ok: true, expiresAt, developmentCode: process.env.NODE_ENV !== "production" ? "11111" : undefined });
}
