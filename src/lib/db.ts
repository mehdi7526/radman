import { PrismaClient } from "@prisma/client";
import { copyFileSync, existsSync } from "fs";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createPrismaClient() {
  const databaseUrl = getDatabaseUrl();
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error"] : ["error"],
    ...(databaseUrl ? { datasources: { db: { url: databaseUrl } } } : {})
  });
}

function getDatabaseUrl() {
  if (!process.env.VERCEL || !process.env.DATABASE_URL?.startsWith("file:")) {
    return undefined;
  }

  const source = path.join(process.cwd(), "prisma", "dev.db");
  const target = path.join("/tmp", "radman-demo.db");
  if (existsSync(source) && !existsSync(target)) {
    copyFileSync(source, target);
  }
  return `file:${target}`;
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
