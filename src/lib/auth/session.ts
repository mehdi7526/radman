import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const cookieName = "radman_session";

function getSecret() {
  return process.env.SESSION_SECRET ?? "radman-dev-session-secret";
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("base64url");
}

export async function createSession(userId: string) {
  const value = `${userId}.${Date.now()}`;
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

export async function getSessionUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get(cookieName)?.value;

  if (!token) {
    return null;
  }

  const [userId, timestamp, signature] = token.split(".");
  if (!userId || !timestamp || !signature) {
    return null;
  }

  const value = `${userId}.${timestamp}`;
  const actual = Buffer.from(sign(value));
  const expected = Buffer.from(signature);

  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    return null;
  }

  return userId;
}

export async function requireAdmin() {
  const userId = await getSessionUserId();

  if (!userId) {
    redirect("/admin/login");
  }

  return userId;
}
