"use server";

import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import path from "path";
import { z } from "zod";
import { hashPassword, needsRehash, verifyPassword } from "@/lib/auth/password";
import { createSession, destroySession, requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { getStorageProvider } from "@/lib/storage/provider";

const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  slug: z.string().min(2),
  shortDescription: z.string().min(8),
  description: z.string().min(8),
  price: z.coerce.number().int().min(0),
  inventory: z.coerce.number().int().min(0),
  categoryId: z.string().optional().or(z.literal("")),
  imageUrls: z.string().optional(),
  imageAlt: z.string().optional(),
  isPublished: z.coerce.boolean().default(false)
});

const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional()
});

const couponSchema = z.object({
  id: z.string().optional(),
  code: z.string().min(2),
  description: z.string().optional(),
  discountType: z.enum(["PERCENT", "FIXED"]),
  discountValue: z.coerce.number().int().min(1),
  minOrderAmount: z.coerce.number().int().min(0).default(0),
  maxUses: z.coerce.number().int().min(1).optional().or(z.literal("")),
  isActive: z.coerce.boolean().default(true),
  expiresAt: z.string().optional()
});

const shippingSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.coerce.number().int().min(0),
  sortOrder: z.coerce.number().int().min(0).default(0),
  isActive: z.coerce.boolean().default(true)
});

async function saveUploadedImages(files: File[]) {
  const urls: string[] = [];

  for (const file of files) {
    if (!(file instanceof File) || file.size === 0) {
      continue;
    }

    if (!file.type.startsWith("image/")) {
      throw new Error("فایل انتخاب‌شده باید تصویر باشد.");
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error("حجم تصویر نباید بیشتر از ۵ مگابایت باشد.");
    }

    const extensionFromName = path.extname(file.name).toLowerCase();
    const extensionFromType = file.type.split("/")[1] ? `.${file.type.split("/")[1]}` : "";
    const extension = extensionFromName || extensionFromType || ".jpg";
    const fileName = `${randomUUID()}${extension}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
    const filePath = path.join(uploadDir, fileName);

    await mkdir(uploadDir, { recursive: true });
    await writeFile(filePath, Buffer.from(await file.arrayBuffer()));
    urls.push(`/uploads/products/${fileName}`);
  }

  return urls;
}

function parseImageUrls(raw: string | undefined) {
  if (!raw?.trim()) {
    return [];
  }

  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export async function loginAdmin(formData: FormData) {
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || user.role !== "ADMIN" || !verifyPassword(password, user.passwordHash)) {
    redirect("/admin/login?error=1");
  }

  if (needsRehash(user.passwordHash)) {
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: hashPassword(password) }
    });
  }

  await createSession(user.id, user.role);
  redirect("/admin");
}

export async function logoutAdmin() {
  await destroySession();
  redirect("/admin/login");
}

export async function saveProduct(formData: FormData) {
  await requireAdmin();

  const imageFiles = formData.getAll("imageFiles").filter((entry): entry is File => entry instanceof File);
  const uploadedImageUrls = await saveUploadedImages(imageFiles);
  const parsed = productSchema.parse({
    id: String(formData.get("id") || ""),
    name: formData.get("name"),
    slug: formData.get("slug"),
    shortDescription: formData.get("shortDescription"),
    description: formData.get("description"),
    price: formData.get("price"),
    inventory: formData.get("inventory"),
    categoryId: formData.get("categoryId"),
    imageUrls: formData.get("imageUrls"),
    imageAlt: formData.get("imageAlt"),
    isPublished: formData.get("isPublished") === "on"
  });

  const storage = getStorageProvider();
  const manualUrls = parseImageUrls(parsed.imageUrls);
  const allUrls = [...uploadedImageUrls, ...manualUrls];
  const images = allUrls.map((url, index) => {
    const resolved = storage.resolve(url, parsed.imageAlt || parsed.name);
    return { url: resolved.url, alt: resolved.alt, sortOrder: index };
  });

  const data = {
    name: parsed.name,
    slug: parsed.slug,
    shortDescription: parsed.shortDescription,
    description: parsed.description,
    price: parsed.price,
    inventory: parsed.inventory,
    isPublished: parsed.isPublished,
    categoryId: parsed.categoryId || null,
    images: images.length
      ? {
          deleteMany: {},
          create: images
        }
      : undefined
  };

  if (parsed.id) {
    await prisma.product.update({ where: { id: parsed.id }, data });
  } else {
    await prisma.product.create({ data });
  }

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidateTag("products");
  revalidateTag("categories");
  redirect(parsed.id ? `/admin/products/${parsed.id}/edit` : "/admin/products");
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  await prisma.product.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function saveCategory(formData: FormData) {
  await requireAdmin();
  const parsed = categorySchema.parse({
    id: String(formData.get("id") || ""),
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description")
  });

  if (parsed.id) {
    await prisma.category.update({
      where: { id: parsed.id },
      data: {
        name: parsed.name,
        slug: parsed.slug,
        description: parsed.description || null
      }
    });
  } else {
    await prisma.category.create({
      data: {
        name: parsed.name,
        slug: parsed.slug,
        description: parsed.description || null
      }
    });
  }

  revalidatePath("/admin/categories");
  revalidatePath("/products");
  redirect("/admin/categories");
}

export async function deleteCategory(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
  revalidatePath("/products");
}

export async function saveCoupon(formData: FormData) {
  await requireAdmin();
  const parsed = couponSchema.parse({
    id: String(formData.get("id") || ""),
    code: String(formData.get("code")).toUpperCase(),
    description: formData.get("description"),
    discountType: formData.get("discountType"),
    discountValue: formData.get("discountValue"),
    minOrderAmount: formData.get("minOrderAmount"),
    maxUses: formData.get("maxUses"),
    isActive: formData.get("isActive") === "on",
    expiresAt: formData.get("expiresAt")
  });

  const data = {
    code: parsed.code,
    description: parsed.description || null,
    discountType: parsed.discountType,
    discountValue: parsed.discountValue,
    minOrderAmount: parsed.minOrderAmount,
    maxUses: parsed.maxUses ? Number(parsed.maxUses) : null,
    isActive: parsed.isActive,
    expiresAt: parsed.expiresAt ? new Date(parsed.expiresAt) : null
  };

  if (parsed.id) {
    await prisma.coupon.update({ where: { id: parsed.id }, data });
  } else {
    await prisma.coupon.create({ data });
  }

  revalidatePath("/admin/coupons");
  redirect("/admin/coupons");
}

export async function deleteCoupon(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  await prisma.coupon.delete({ where: { id } });
  revalidatePath("/admin/coupons");
}

export async function saveShippingMethod(formData: FormData) {
  await requireAdmin();
  const parsed = shippingSchema.parse({
    id: String(formData.get("id") || ""),
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    sortOrder: formData.get("sortOrder"),
    isActive: formData.get("isActive") === "on"
  });

  const data = {
    name: parsed.name,
    description: parsed.description || null,
    price: parsed.price,
    sortOrder: parsed.sortOrder,
    isActive: parsed.isActive
  };

  if (parsed.id) {
    await prisma.shippingMethod.update({ where: { id: parsed.id }, data });
  } else {
    await prisma.shippingMethod.create({ data });
  }

  revalidatePath("/admin/shipping");
  revalidatePath("/checkout");
  redirect("/admin/shipping");
}

export async function deleteShippingMethod(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  await prisma.shippingMethod.delete({ where: { id } });
  revalidatePath("/admin/shipping");
  revalidatePath("/checkout");
}

export async function updateOrderStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  const trackingCode = String(formData.get("trackingCode") || "");

  await prisma.order.update({
    where: { id },
    data: {
      status: status as "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED",
      trackingCode: trackingCode || null
    }
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath(`/account/orders/${id}`);
  redirect(`/admin/orders/${id}`);
}
