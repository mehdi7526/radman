import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-20 border-t bg-white">
      <div className="container grid gap-8 py-10 md:grid-cols-3">
        <div>
          <p className="text-lg font-bold text-sky-950">رادمان</p>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            فروشگاه دستگاه تصفیه آب، دستگاه تصفیه هوا و فیلترهای مصرفی برای خانه و محل کار.
          </p>
        </div>
        <div className="text-sm leading-8">
          <p className="font-semibold">دسترسی سریع</p>
          <Link className="block text-muted-foreground" href="/products">
            محصولات
          </Link>
          <Link className="block text-muted-foreground" href="/cart">
            سبد خرید
          </Link>
        </div>
        <div className="text-sm leading-8 text-muted-foreground">
          <p className="font-semibold text-foreground">پشتیبانی</p>
          <p>تهران، ایران</p>
          <p>۰۲۱-۰۰۰۰۰۰۰۰</p>
        </div>
      </div>
    </footer>
  );
}
