"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { hashPassword } from "@/lib/auth/password";
import { createSession, destroySession, requireCustomer } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

const registerSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().email(),
  phone: z.string().trim().min(8),
  password: z.string().min(6)
});

export async function registerCustomer(formData: FormData) {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password")
  });

  if (!parsed.success) {
    redirect("/account/register?error=1");
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    redirect("/account/register?error=exists");
  }

  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      passwordHash: hashPassword(parsed.data.password),
      role: "CUSTOMER"
    }
  });

  await createSession(user.id, "CUSTOMER");
  redirect("/account");
}

export async function loginCustomer(formData: FormData) {
  const phone = String(formData.get("phone")).trim();
  const otp = String(formData.get("otp")).trim();
  const requestedNext = String(formData.get("next") ?? "");
  const next = requestedNext.startsWith("/") && !requestedNext.startsWith("//") ? requestedNext : "/account";
  const user = await prisma.user.findFirst({ where: { phone, role: "CUSTOMER" } });
  const developmentOtp = process.env.DEV_OTP_CODE ?? "11111";

  if (!user || otp !== developmentOtp) {
    redirect(`/account/login?error=1${next !== "/account" ? `&next=${encodeURIComponent(next)}` : ""}`);
  }

  await createSession(user.id, "CUSTOMER");
  redirect(next);
}

export async function logoutCustomer() {
  await destroySession();
  redirect("/");
}

export async function updateCustomerProfile(formData: FormData) {
  const user = await requireCustomer();
  const name = String(formData.get("name"));
  const phone = String(formData.get("phone"));

  await prisma.user.update({
    where: { id: user.id },
    data: { name, phone }
  });

  redirect("/account");
}

export async function saveAddress(formData: FormData) {
  const user = await requireCustomer();
  const id = String(formData.get("id") ?? "");
  const data = {
    title: String(formData.get("title") ?? "خانه").trim(),
    recipient: String(formData.get("recipient") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    province: String(formData.get("province") ?? "").trim(),
    city: String(formData.get("city") ?? "").trim(),
    postalCode: String(formData.get("postalCode") ?? "").trim(),
    address: String(formData.get("address") ?? "").trim(),
    plaque: String(formData.get("plaque") ?? "").trim() || null,
    unit: String(formData.get("unit") ?? "").trim() || null,
    isDefault: formData.get("isDefault") === "on"
  };
  if (!data.recipient || !data.phone || !data.province || !data.city || !/^\d{10}$/.test(data.postalCode) || data.address.length < 8) {
    redirect("/account?addressError=1");
  }
  await prisma.$transaction(async (tx) => {
    if (data.isDefault) await tx.address.updateMany({ where: { userId: user.id }, data: { isDefault: false } });
    if (id) {
      await tx.address.updateMany({ where: { id, userId: user.id }, data });
    } else {
      const count = await tx.address.count({ where: { userId: user.id } });
      await tx.address.create({ data: { ...data, isDefault: data.isDefault || count === 0, userId: user.id } });
    }
  });
  revalidatePath("/account");
  revalidatePath("/checkout");
  redirect("/account");
}

export async function deleteAddress(formData: FormData) {
  const user = await requireCustomer();
  const id = String(formData.get("id") ?? "");
  await prisma.address.deleteMany({ where: { id, userId: user.id } });
  revalidatePath("/account");
  revalidatePath("/checkout");
}
