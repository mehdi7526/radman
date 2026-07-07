import { deleteCategory, saveCategory } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { prisma } from "@/lib/db";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" }
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black text-sky-950">دسته‌بندی‌ها</h2>
        <p className="mt-1 text-sm text-muted-foreground">مدیریت دسته‌های محصولات</p>
      </div>

      <Card className="p-5">
        <h3 className="font-bold">دسته جدید</h3>
        <form action={saveCategory} className="mt-4 grid gap-4 md:grid-cols-2">
          <Input name="name" placeholder="نام دسته" required />
          <Input name="slug" placeholder="slug" dir="ltr" required />
          <Textarea name="description" placeholder="توضیحات" className="md:col-span-2" />
          <Button type="submit" className="md:col-span-2">افزودن دسته</Button>
        </form>
      </Card>

      <div className="space-y-3">
        {categories.map((category) => (
          <Card key={category.id} className="p-4">
            <form action={saveCategory} className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto_auto]">
              <input type="hidden" name="id" value={category.id} />
              <Input name="name" defaultValue={category.name} required />
              <Input name="slug" defaultValue={category.slug} dir="ltr" required />
              <Input name="description" defaultValue={category.description ?? ""} />
              <Button type="submit" variant="outline">ذخیره</Button>
            </form>
            <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
              <span>{category._count.products} محصول</span>
              <form action={deleteCategory}>
                <input type="hidden" name="id" value={category.id} />
                <Button variant="destructive" size="sm">حذف</Button>
              </form>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
