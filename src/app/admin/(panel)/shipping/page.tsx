import { deleteShippingMethod, saveShippingMethod } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/format";

export default async function AdminShippingPage() {
  const methods = await prisma.shippingMethod.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black text-sky-950">روش‌های ارسال</h2>
      </div>

      <Card className="p-5">
        <h3 className="font-bold">روش جدید</h3>
        <form action={saveShippingMethod} className="mt-4 grid gap-4 md:grid-cols-2">
          <Input name="name" placeholder="نام روش" required />
          <Input name="price" type="number" placeholder="هزینه (تومان)" required />
          <Input name="sortOrder" type="number" placeholder="ترتیب" defaultValue={0} />
          <Textarea name="description" placeholder="توضیحات" className="md:col-span-2" />
          <label className="flex items-center gap-2 text-sm">
            <input name="isActive" type="checkbox" defaultChecked />
            فعال
          </label>
          <Button type="submit" className="md:col-span-2">افزودن</Button>
        </form>
      </Card>

      <div className="space-y-3">
        {methods.map((method) => (
          <Card key={method.id} className="p-4">
            <form action={saveShippingMethod} className="grid gap-3 md:grid-cols-[1fr_120px_80px_1fr_auto]">
              <input type="hidden" name="id" value={method.id} />
              <Input name="name" defaultValue={method.name} required />
              <Input name="price" type="number" defaultValue={method.price} required />
              <Input name="sortOrder" type="number" defaultValue={method.sortOrder} />
              <Input name="description" defaultValue={method.description ?? ""} />
              <Button type="submit" variant="outline">ذخیره</Button>
            </form>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="font-bold text-primary">{formatPrice(method.price)}</span>
              <form action={deleteShippingMethod}>
                <input type="hidden" name="id" value={method.id} />
                <Button variant="destructive" size="sm">حذف</Button>
              </form>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
