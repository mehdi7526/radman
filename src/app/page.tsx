import Link from "next/link";
import { ArrowLeft, PackageCheck, ShieldCheck, Truck, Wind } from "lucide-react";
import { BrandDivider } from "@/components/brand/brand-divider";
import { BrandGear } from "@/components/brand/brand-gear";
import { LogoMark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/product-card";
import { brand } from "@/lib/brand";
import { getCachedFeaturedProducts } from "@/lib/queries/products";

export const revalidate = 60;

const filtrationStages = [
  { step: "۱", title: "پیش‌فیلتر", text: "حذف رسوب، گل و ذرات درشت قبل از ورود به سیستم اصلی" },
  { step: "۲", title: "ممبران RO", text: "جداسازی یون‌ها و آلاینده‌های محلول در آب شرب" },
  { step: "۳", title: "کربن فعال", text: "بهبود طعم و بو، کاهش کلر و ترکیبات آلی" },
  { step: "۴", title: "HEPA / UV", text: "فیلتراسیون هوا و ضدعفونی نهایی برای فضای داخلی" }
];

export default async function HomePage() {
  const products = await getCachedFeaturedProducts();

  return (
    <>
      <section aria-labelledby="hero-heading" className="bg-foreground text-background">
        <div className="container grid min-h-[calc(100dvh-4.5rem)] items-center gap-10 py-12 lg:grid-cols-[1.15fr_0.85fr] lg:py-16">
          <div className="max-w-2xl">
            <p className="eyebrow">{brand.taglineEn}</p>
            <h1 id="hero-heading" className="mt-4 text-balance text-3xl font-bold leading-[1.4] xs:text-4xl lg:text-[2.75rem]">
              سیستم تصفیه‌ای که کیفیت آب و هوای فضای شما را قابل اندازه‌گیری می‌کند
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-base leading-8 text-background/75 md:text-lg">
              {brand.name} دستگاه‌های تصفیه آب خانگی، تصفیه هوا و فیلترهای مصرفی را با مشخصات شفاف،
              قیمت‌گذاری روشن و پشتیبانی فیلتر ارائه می‌دهد.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="accent">
                <Link href="/products">
                  مشاهده محصولات
                  <ArrowLeft className="size-5" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-background/25 bg-transparent text-background hover:bg-background/10"
              >
                <Link href="/track">پیگیری سفارش</Link>
              </Button>
            </div>
            <dl className="mt-10 grid gap-px border border-signal/20 sm:grid-cols-3">
              {[
                ["۲۴", "ساعت", "آماده‌سازی سفارش"],
                ["HEPA", "کلاس", "فیلتراسیون هوا"],
                ["RO", "ممبران", "تصفیه آب خانگی"]
              ].map(([value, unit, label]) => (
                <div key={label} className="hero-panel px-4 py-4">
                  <dt className="spec-label text-background/55">{label}</dt>
                  <dd className="mt-1 flex items-baseline gap-2">
                    <span className="text-2xl font-bold tabular-nums">{value}</span>
                    <span className="text-xs text-background/60">{unit}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <aside aria-label="هویت برند و مراحل فیلتراسیون" className="border border-signal/25 bg-background/5 p-6 lg:p-8">
            <div className="flex flex-col items-center text-center">
              <div className="brand-frame rounded-full">
                <LogoMark size="xl" priority className="rounded-full" />
              </div>
              <p className="mt-4 text-sm font-bold text-signal">{brand.nameEn}</p>
              <p className="mt-1 text-xs text-background/60">{brand.descriptor}</p>
            </div>
            <BrandDivider className="my-6" tone="dark" />
            <div className="flex items-start justify-between gap-4 border-b border-signal/20 pb-6">
              <div>
                <p className="eyebrow-muted text-signal">Radman Spec</p>
                <h2 className="mt-2 text-balance text-xl font-bold">مسیر فیلتراسیون استاندارد</h2>
              </div>
              <BrandGear size={24} className="shrink-0 text-signal" />
            </div>
            <ol className="mt-6 space-y-3">
              {filtrationStages.map((stage) => (
                <li key={stage.step} className="hero-panel flex gap-4 px-4 py-4">
                  <span className="flex size-8 shrink-0 items-center justify-center border border-signal/25 text-xs font-bold tabular-nums text-signal">
                    {stage.step}
                  </span>
                  <div>
                    <p className="font-bold">{stage.title}</p>
                    <p className="mt-1 text-pretty text-sm leading-6 text-background/70">{stage.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </section>

      <section aria-labelledby="services-heading" className="border-b border-border bg-porcelain">
        <div className="container py-12 md:py-16">
          <BrandDivider className="mb-8 md:hidden" />
          <h2 id="services-heading" className="sr-only">
            خدمات {brand.name}
          </h2>
          <ul className="grid gap-px border border-border bg-border md:grid-cols-3">
            {[
              { icon: ShieldCheck, title: "مشاوره دقیق", text: "انتخاب دستگاه بر اساس متراژ، مصرف آب و سطح آلودگی هوا." },
              { icon: Truck, title: "ارسال و نصب", text: "هماهنگی تحویل، نصب و راه‌اندازی برای خانه و محل کار." },
              { icon: PackageCheck, title: "فیلتر و قطعات", text: "یادآوری تعویض فیلتر و دسترسی به قطعات مصرفی اصلی." }
            ].map((item) => (
              <li key={item.title} className="bg-porcelain p-6 md:p-8">
                <item.icon className="size-6 text-oxygen" aria-hidden="true" />
                <h3 className="mt-4 text-balance font-bold text-foreground">{item.title}</h3>
                <p className="mt-2 text-pretty text-sm leading-7 text-muted-foreground">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="categories-heading" className="container py-12 md:py-16">
        <BrandDivider className="mb-8" />
        <h2 id="categories-heading" className="sr-only">
          دسته‌بندی محصولات
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Link
            href="/products?category=water-purifier"
            className="group flex min-h-44 flex-col justify-between border border-border bg-porcelain p-6 transition-shadow duration-150 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:p-8"
          >
            <BrandGear size={32} className="text-primary" />
            <div>
              <h3 className="text-balance text-xl font-bold text-foreground group-hover:text-oxygen">تصفیه آب</h3>
              <p className="mt-2 text-pretty text-sm leading-7 text-muted-foreground">
                دستگاه‌های RO، ultrafiltration و فیلترهای زیر سینک برای آب آشامیدنی.
              </p>
            </div>
          </Link>
          <Link
            href="/products?category=air-purifier"
            className="group flex min-h-44 flex-col justify-between border border-border bg-porcelain p-6 transition-shadow duration-150 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:p-8"
          >
            <Wind className="size-8 text-primary" aria-hidden="true" />
            <div>
              <h3 className="text-balance text-xl font-bold text-foreground group-hover:text-oxygen">تصفیه هوا</h3>
              <p className="mt-2 text-pretty text-sm leading-7 text-muted-foreground">
                دستگاه‌های HEPA برای اتاق خواب، پذیرایی و فضاهای اداری.
              </p>
            </div>
          </Link>
        </div>
      </section>

      <section aria-labelledby="featured-heading" className="border-t border-border bg-muted/40">
        <div className="container py-12 md:py-16">
          <BrandDivider className="mb-8" />
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">پیشنهاد {brand.name}</p>
              <h2 id="featured-heading" className="mt-2 text-balance text-2xl font-bold text-foreground md:text-3xl">
                محصولات منتخب
              </h2>
            </div>
            <Button asChild variant="outline">
              <Link href="/products">همه محصولات</Link>
            </Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
