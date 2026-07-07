import { ProductForm } from "@/components/admin/product-form";
import { prisma } from "@/lib/db";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black text-sky-950">محصول جدید</h2>
        <p className="mt-1 text-sm text-muted-foreground">افزودن محصول جدید به فروشگاه</p>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
