import bcrypt from "bcryptjs";
import { createHash, timingSafeEqual } from "crypto";

const BCRYPT_PREFIX = "$2";

function hashLegacy(password: string) {
  return createHash("sha256").update(password).digest("hex");
}

export function hashPassword(password: string) {
  return bcrypt.hashSync(password, 12);
}

export function verifyPassword(password: string, hash: string) {
  if (hash.startsWith(BCRYPT_PREFIX)) {
    return bcrypt.compareSync(password, hash);
  }

  const current = Buffer.from(hashLegacy(password), "hex");
  const expected = Buffer.from(hash, "hex");

  if (current.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(current, expected);
}

export function needsRehash(hash: string) {
  return !hash.startsWith(BCRYPT_PREFIX);
}
