import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { saveProduct } from "@/app/admin/actions";

type ProductFormProps = {
  product?: {
    id: string;
    name: string;
    slug: string;
    shortDescription: string;
    description: string;
    price: number;
    inventory: number;
    isPublished: boolean;
    images: { url: string; alt: string }[];
  };
};

export function ProductForm({ product }: ProductFormProps) {
  const image = product?.images[0];

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
          انتخاب تصویر از سیستم
          <Input name="imageFile" type="file" accept="image/*" />
        </label>
        <label className="space-y-2 text-sm font-medium">
          متن جایگزین تصویر
          <Input name="imageAlt" defaultValue={image?.alt} />
        </label>
      </div>
      <label className="space-y-2 text-sm font-medium">
        URL تصویر فعلی یا خارجی
        <Input name="imageUrl" defaultValue={image?.url} dir="ltr" />
      </label>
      {image?.url ? (
        <p className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground" dir="ltr">
          {image.url}
        </p>
      ) : null}
      <label className="flex items-center gap-2 text-sm font-medium">
        <input name="isPublished" type="checkbox" defaultChecked={product?.isPublished ?? true} />
        منتشر شود
      </label>
      <Button type="submit">{product ? "ذخیره تغییرات" : "ساخت محصول"}</Button>
    </form>
  );
}
