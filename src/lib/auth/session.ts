import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import type { UserRole } from "@prisma/client";
import { prisma } from "@/lib/db";

const cookieName = "radman_session";

function getSecret() {
  return process.env.SESSION_SECRET ?? "radman-dev-session-secret";
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("base64url");
}

function parseSessionToken(token: string) {
  const parts = token.split(".");
  if (parts.length < 3) {
    return null;
  }

  const signature = parts.at(-1);
  if (!signature) {
    return null;
  }

  if (parts.length === 3) {
    const [userId, timestamp] = parts;
    const value = `${userId}.${timestamp}`;
    const actual = Buffer.from(sign(value));
    const expected = Buffer.from(signature);

    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
      return null;
    }

    return { userId, role: null as UserRole | null };
  }

  const [userId, timestamp, role, sig] = parts;
  const value = `${userId}.${timestamp}.${role}`;
  const actual = Buffer.from(sign(value));
  const expected = Buffer.from(sig);

  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    return null;
  }

  return { userId, role: role as UserRole };
}

export async function createSession(userId: string, role: UserRole) {
  const value = `${userId}.${Date.now()}.${role}`;
  const token = `${value}.${sign(value)}`;
  const cookieStore = await cookies();

  cookieStore.set(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(cookieName);
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(cookieName)?.value;
  if (!token) {
    return null;
  }

  return parseSessionToken(token);
}

export async function getSessionUserId() {
  const session = await getSession();
  return session?.userId ?? null;
}

export const getCurrentUser = cache(async () => {
  const session = await getSession();
  if (!session) {
    return null;
  }

  return prisma.user.findUnique({ where: { id: session.userId } });
});

export async function requireAdmin() {
  const session = await getSession();

  if (!session?.userId) {
    redirect("/admin/login");
  }

  if (session.role === "ADMIN") {
    return prisma.user.findUniqueOrThrow({ where: { id: session.userId } });
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user || user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  return user;
}

export async function requireCustomer() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/account/login");
  }

  return user;
}

export function getSessionCookieName() {
  return cookieName;
}
