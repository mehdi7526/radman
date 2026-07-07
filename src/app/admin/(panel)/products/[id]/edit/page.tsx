import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { prisma } from "@/lib/db";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { images: { orderBy: { sortOrder: "asc" } } }
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } })
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black text-sky-950">ویرایش محصول</h2>
        <p className="mt-1 text-sm text-muted-foreground">{product.name}</p>
      </div>
      <ProductForm product={product} categories={categories} />
    </div>
  );
}
