"use server";

import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import path from "path";
import { z } from "zod";
import { createSession, destroySession, requireAdmin } from "@/lib/auth/session";
import { verifyPassword } from "@/lib/auth/password";
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
  imageUrl: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((value) => !value || value.startsWith("/") || z.string().url().safeParse(value).success, {
      message: "Image URL must be a URL or a local path."
    }),
  imageAlt: z.string().optional(),
  isPublished: z.coerce.boolean().default(false)
});

async function saveUploadedImage(file: File) {
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

  return `/uploads/products/${fileName}`;
}

export async function loginAdmin(formData: FormData) {
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !verifyPassword(password, user.passwordHash)) {
    redirect("/admin/login?error=1");
  }

  await createSession(user.id);
  redirect("/admin");
}

export async function logoutAdmin() {
  await destroySession();
  redirect("/admin/login");
}

export async function saveProduct(formData: FormData) {
  await requireAdmin();
  const imageFile = formData.get("imageFile");
  const uploadedImageUrl =
    imageFile instanceof File && imageFile.size > 0 ? await saveUploadedImage(imageFile) : null;
  const parsed = productSchema.parse({
    id: String(formData.get("id") || ""),
    name: formData.get("name"),
    slug: formData.get("slug"),
    shortDescription: formData.get("shortDescription"),
    description: formData.get("description"),
    price: formData.get("price"),
    inventory: formData.get("inventory"),
    imageUrl: uploadedImageUrl ?? formData.get("imageUrl"),
    imageAlt: formData.get("imageAlt"),
    isPublished: formData.get("isPublished") === "on"
  });
  const storage = getStorageProvider();
  const image = parsed.imageUrl ? storage.resolve(parsed.imageUrl, parsed.imageAlt || parsed.name) : null;

  if (parsed.id) {
    await prisma.product.update({
      where: { id: parsed.id },
      data: {
        name: parsed.name,
        slug: parsed.slug,
        shortDescription: parsed.shortDescription,
        description: parsed.description,
        price: parsed.price,
        inventory: parsed.inventory,
        isPublished: parsed.isPublished,
        images: image
          ? {
              deleteMany: {},
              create: { url: image.url, alt: image.alt, sortOrder: 0 }
            }
          : undefined
      }
    });
  } else {
    await prisma.product.create({
      data: {
        name: parsed.name,
        slug: parsed.slug,
        shortDescription: parsed.shortDescription,
        description: parsed.description,
        price: parsed.price,
        inventory: parsed.inventory,
        isPublished: parsed.isPublished,
        images: image ? { create: { url: image.url, alt: image.alt, sortOrder: 0 } } : undefined
      }
    });
  }

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  await prisma.product.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin");
}
