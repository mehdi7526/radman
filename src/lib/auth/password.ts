import { createHash, timingSafeEqual } from "crypto";

export function hashPassword(password: string) {
  return createHash("sha256").update(password).digest("hex");
}

export function verifyPassword(password: string, hash: string) {
  const current = Buffer.from(hashPassword(password), "hex");
  const expected = Buffer.from(hash, "hex");

  if (current.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(current, expected);
}
