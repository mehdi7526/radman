import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function addColumnIfMissing(table: string, column: string, definition: string) {
  const columns = await prisma.$queryRawUnsafe<Array<{ name: string }>>(
    `PRAGMA table_info("${table}");`
  );
  if (!columns.some((entry) => entry.name === column)) {
    await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" ADD COLUMN "${column}" ${definition};`);
  }
}

async function main() {
  await prisma.$executeRawUnsafe("PRAGMA journal_mode = WAL;");
  await prisma.$executeRawUnsafe("PRAGMA synchronous = NORMAL;");
  await prisma.$executeRawUnsafe("PRAGMA foreign_keys = ON;");

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "User" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "email" TEXT NOT NULL UNIQUE,
      "name" TEXT NOT NULL,
      "phone" TEXT,
      "passwordHash" TEXT NOT NULL,
      "role" TEXT NOT NULL DEFAULT 'CUSTOMER',
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await addColumnIfMissing("User", "phone", "TEXT");

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Category" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "slug" TEXT NOT NULL UNIQUE,
      "name" TEXT NOT NULL,
      "description" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Product" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "slug" TEXT NOT NULL UNIQUE,
      "name" TEXT NOT NULL,
      "shortDescription" TEXT NOT NULL,
      "description" TEXT NOT NULL,
      "price" INTEGER NOT NULL,
      "inventory" INTEGER NOT NULL DEFAULT 0,
      "isPublished" BOOLEAN NOT NULL DEFAULT false,
      "categoryId" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
    );
  `);

  await addColumnIfMissing("Product", "categoryId", "TEXT");

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "ProductImage" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "url" TEXT NOT NULL,
      "alt" TEXT NOT NULL,
      "sortOrder" INTEGER NOT NULL DEFAULT 0,
      "productId" TEXT NOT NULL,
      CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Coupon" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "code" TEXT NOT NULL UNIQUE,
      "description" TEXT,
      "discountType" TEXT NOT NULL,
      "discountValue" INTEGER NOT NULL,
      "minOrderAmount" INTEGER NOT NULL DEFAULT 0,
      "maxUses" INTEGER,
      "usedCount" INTEGER NOT NULL DEFAULT 0,
      "isActive" BOOLEAN NOT NULL DEFAULT true,
      "expiresAt" DATETIME,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "ShippingMethod" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "name" TEXT NOT NULL,
      "description" TEXT,
      "price" INTEGER NOT NULL,
      "isActive" BOOLEAN NOT NULL DEFAULT true,
      "sortOrder" INTEGER NOT NULL DEFAULT 0,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Order" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "userId" TEXT,
      "customerName" TEXT NOT NULL,
      "customerPhone" TEXT NOT NULL,
      "customerEmail" TEXT,
      "address" TEXT NOT NULL,
      "note" TEXT,
      "subtotal" INTEGER NOT NULL DEFAULT 0,
      "discountAmount" INTEGER NOT NULL DEFAULT 0,
      "shippingCost" INTEGER NOT NULL DEFAULT 0,
      "total" INTEGER NOT NULL,
      "couponId" TEXT,
      "couponCode" TEXT,
      "shippingMethodId" TEXT,
      "trackingCode" TEXT,
      "status" TEXT NOT NULL DEFAULT 'PENDING',
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
      CONSTRAINT "Order_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "Coupon" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
      CONSTRAINT "Order_shippingMethodId_fkey" FOREIGN KEY ("shippingMethodId") REFERENCES "ShippingMethod" ("id") ON DELETE SET NULL ON UPDATE CASCADE
    );
  `);

  await addColumnIfMissing("Order", "userId", "TEXT");
  await addColumnIfMissing("Order", "subtotal", "INTEGER NOT NULL DEFAULT 0");
  await addColumnIfMissing("Order", "discountAmount", "INTEGER NOT NULL DEFAULT 0");
  await addColumnIfMissing("Order", "shippingCost", "INTEGER NOT NULL DEFAULT 0");
  await addColumnIfMissing("Order", "couponId", "TEXT");
  await addColumnIfMissing("Order", "couponCode", "TEXT");
  await addColumnIfMissing("Order", "shippingMethodId", "TEXT");
  await addColumnIfMissing("Order", "trackingCode", "TEXT");

  await prisma.$executeRawUnsafe(`
    UPDATE "Order" SET "subtotal" = "total" WHERE "subtotal" = 0;
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "OrderItem" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "quantity" INTEGER NOT NULL,
      "unitPrice" INTEGER NOT NULL,
      "orderId" TEXT NOT NULL,
      "productId" TEXT NOT NULL,
      CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Payment" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "provider" TEXT NOT NULL,
      "authority" TEXT,
      "amount" INTEGER NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'PENDING',
      "redirectUrl" TEXT,
      "referenceId" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "orderId" TEXT NOT NULL UNIQUE,
      CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Notification" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "type" TEXT NOT NULL,
      "title" TEXT NOT NULL,
      "body" TEXT NOT NULL,
      "isRead" BOOLEAN NOT NULL DEFAULT false,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
