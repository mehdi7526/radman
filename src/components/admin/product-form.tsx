import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { saveProduct } from "@/app/admin/actions";

type Category = { id: string; name: string };

type ProductFormProps = {
  categories: Category[];
  product?: {
    id: string;
    name: string;
    slug: string;
    shortDescription: string;
    description: string;
    price: number;
    inventory: number;
    isPublished: boolean;
    categoryId: string | null;
    images: { url: string; alt: string }[];
  };
};

export function ProductForm({ product, categories }: ProductFormProps) {
  const imageUrls = product?.images.map((image) => image.url).join("\n") ?? "";
  const imageAlt = product?.images[0]?.alt ?? "";

  return (
    <form action={saveProduct} className="space-y-4 rounded-lg border bg-white p-5">
      <input type="hidden" name="id" value={product?.id ?? ""} />
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium">
          نام محصول
          <Input name="name" defaultValue={product?.name} required />
        </label>
        <label className="space-y-2 text-sm font-medium">
          اسلاگ
          <Input name="slug" defaultValue={product?.slug} required dir="ltr" />
        </label>
      </div>
      <label className="space-y-2 text-sm font-medium">
        دسته‌بندی
        <select
          name="categoryId"
          defaultValue={product?.categoryId ?? ""}
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">بدون دسته</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      <label className="space-y-2 text-sm font-medium">
        توضیح کوتاه
        <Input name="shortDescription" defaultValue={product?.shortDescription} required />
      </label>
      <label className="space-y-2 text-sm font-medium">
        توضیحات کامل
        <Textarea name="description" defaultValue={product?.description} required />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium">
          قیمت تومان
          <Input name="price" type="number" defaultValue={product?.price ?? 0} required />
        </label>
        <label className="space-y-2 text-sm font-medium">
          موجودی
          <Input name="inventory" type="number" defaultValue={product?.inventory ?? 0} required />
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium">
          آپلود تصاویر (چند فایل)
          <Input name="imageFiles" type="file" accept="image/*" multiple />
        </label>
        <label className="space-y-2 text-sm font-medium">
          متن جایگزین تصویر
          <Input name="imageAlt" defaultValue={imageAlt} />
        </label>
      </div>
      <label className="space-y-2 text-sm font-medium">
        URL تصاویر (هر خط یک URL)
        <Textarea name="imageUrls" defaultValue={imageUrls} dir="ltr" rows={4} />
      </label>
      <label className="flex items-center gap-2 text-sm font-medium">
        <input name="isPublished" type="checkbox" defaultChecked={product?.isPublished ?? true} />
        منتشر شود
      </label>
      <Button type="submit">{product ? "ذخیره تغییرات" : "ساخت محصول"}</Button>
    </form>
  );
}
