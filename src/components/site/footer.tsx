import Link from "next/link";
import { BrandDivider } from "@/components/brand/brand-divider";
import { Logo } from "@/components/brand/logo";
import { brand } from "@/lib/brand";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-porcelain">
      <div className="container py-12">
        <BrandDivider className="mb-10" />
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo size="lg" showText={false} />
            <p className="mt-4 text-balance text-lg font-bold text-foreground">{brand.name}</p>
            <p className="mt-1 text-sm font-semibold text-signal">{brand.taglineEn}</p>
            <p className="mt-3 max-w-sm text-pretty text-sm leading-7 text-muted-foreground">
              فروشگاه تخصصی دستگاه تصفیه آب، تصفیه هوا و فیلترهای مصرفی — با مشاوره دقیق، ارسال منظم و
              پشتیبانی فیلتر.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">دسترسی سریع</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link className="text-muted-foreground hover:text-oxygen" href="/products">
                  محصولات
                </Link>
              </li>
              <li>
                <Link className="text-muted-foreground hover:text-oxygen" href="/cart">
                  سبد خرید
                </Link>
              </li>
              <li>
                <Link className="text-muted-foreground hover:text-oxygen" href="/track">
                  پیگیری سفارش
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">پشتیبانی</p>
            <address className="mt-3 space-y-1 text-sm not-italic leading-7 text-muted-foreground">
              <p>تهران، ایران</p>
              <p dir="ltr" className="text-start">
                ۰۲۱-۰۰۰۰۰۰۰۰
              </p>
            </address>
          </div>
        </div>
      </div>
      <div className="section-rule" />
      <div className="container py-4 text-xs text-muted-foreground">
        © {new Date().getFullYear()} {brand.name} — تمامی حقوق محفوظ است.
      </div>
    </footer>
  );
}
