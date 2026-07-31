import Link from "next/link";
import { BrandDivider } from "@/components/brand/brand-divider";
import { Logo } from "@/components/brand/logo";
import { brand } from "@/lib/brand";

export function Footer() {
  return (
    <footer className="border-t border-[#2b6076] bg-[#123548] text-white">
      <div className="container py-12">
        <BrandDivider className="mb-10" tone="dark" />
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo size="lg" showText={false} />
            <p className="mt-4 text-balance text-lg font-bold text-white">{brand.name}</p>
            <p className="mt-1 text-sm font-semibold text-amber-200">{brand.taglineEn}</p>
            <p className="mt-3 max-w-sm text-pretty text-sm leading-7 text-white/65">
              فروشگاه تخصصی دستگاه تصفیه آب، تصفیه هوا و فیلترهای مصرفی — با مشاوره دقیق، ارسال منظم و
              پشتیبانی فیلتر.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white">دسترسی سریع</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link className="text-white/65 transition-colors hover:text-amber-200" href="/products">
                  محصولات
                </Link>
              </li>
              <li>
                <Link className="text-white/65 transition-colors hover:text-amber-200" href="/cart">
                  سبد خرید
                </Link>
              </li>
              <li>
                <Link className="text-white/65 transition-colors hover:text-amber-200" href="/track">
                  پیگیری سفارش
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-bold text-white">پشتیبانی</p>
            <address className="mt-3 space-y-1 text-sm not-italic leading-7 text-white/65">
              <p>تهران، ایران</p>
              <p dir="ltr" className="text-start">
                ۰۲۱-۰۰۰۰۰۰۰۰
              </p>
            </address>
          </div>
        </div>
      </div>
      <div className="h-px bg-white/15" />
      <div className="container py-4 text-xs text-white/45">
        © {new Date().getFullYear()} {brand.name} — تمامی حقوق محفوظ است.
      </div>
    </footer>
  );
}

