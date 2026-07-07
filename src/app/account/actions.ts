"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { hashPassword, needsRehash, verifyPassword } from "@/lib/auth/password";
import { createSession, destroySession, requireCustomer } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

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
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || user.role !== "CUSTOMER" || !verifyPassword(password, user.passwordHash)) {
    redirect("/account/login?error=1");
  }

  if (needsRehash(user.passwordHash)) {
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: hashPassword(password) }
    });
  }

  await createSession(user.id, "CUSTOMER");
  redirect("/account");
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
