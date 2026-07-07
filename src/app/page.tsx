import Link from "next/link";
import { ArrowLeft, BadgeCheck, Gauge, PackageCheck, ShieldCheck, Sparkles, Truck, Waves, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/product-card";
import { getCachedFeaturedProducts } from "@/lib/queries/products";

export const revalidate = 60;

export default async function HomePage() {
  const products = await getCachedFeaturedProducts();

  return (
    <>
      <section className="waterfall">
        <div className="hero-grid absolute inset-0" />
        <div className="container relative grid min-h-[calc(100vh-4rem)] items-center gap-10 py-14 lg:grid-cols-[1fr_430px]">
          <div className="max-w-3xl text-white">
            <p className="mb-5 inline-flex rounded-md border border-white/20 bg-white/12 px-4 py-2 text-sm font-bold text-cyan-50 backdrop-blur">
              فروشگاه تخصصی دستگاه تصفیه آب و تصفیه هوا
            </p>
            <h1 className="max-w-4xl text-4xl font-black leading-[1.45] sm:text-5xl lg:text-6xl">
              هوای تمیزتر، آب مطمئن‌تر، انتخاب حرفه‌ای‌تر
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-9 text-cyan-50">
              رادمان برای خانه و محل کار، دستگاه‌های تصفیه آب و تصفیه هوا را با اطلاعات شفاف، خرید ساده و پشتیبانی قابل اتکا ارائه می‌کند.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="secondary">
                <Link href="/products">
                  مشاهده محصولات
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/35 bg-white/10 text-white hover:bg-white/20">
                <Link href="/cart">سبد خرید</Link>
              </Button>
            </div>
            <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
              {[
                ["۲۴ ساعت", "آماده‌سازی سفارش"],
                ["HEPA", "تمرکز روی کیفیت هوا"],
                ["RO", "فیلتراسیون آب خانگی"]
              ].map(([value, label]) => (
                <div key={label} className="rounded-lg border border-white/16 bg-white/10 p-4 backdrop-blur">
                  <p className="text-2xl font-black">{value}</p>
                  <p className="mt-1 text-xs font-medium text-cyan-50">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="spec-panel soft-border relative overflow-hidden rounded-lg border p-6 shadow-water">
            <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-primary">Radman Care</p>
                <h2 className="mt-2 text-2xl font-black text-sky-950">انتخاب بر اساس نیاز واقعی</h2>
              </div>
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-sky-950 text-white">
                <Waves className="h-6 w-6" />
              </span>
            </div>
            <div className="space-y-4">
              {[
                { icon: Wind, title: "کیفیت هوا", text: "مناسب اتاق خواب، پذیرایی و فضای کار" },
                { icon: Gauge, title: "کیفیت آب", text: "انتخاب دستگاه بر اساس مصرف و شرایط آب" },
                { icon: ShieldCheck, title: "خدمات بعد از خرید", text: "پیگیری فیلتر و پشتیبانی محصول" }
              ].map((item) => (
                <div key={item.title} className="flex gap-4 rounded-lg border border-sky-100 bg-white p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-cyan-50 text-primary">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-bold text-sky-950">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="hero-stream mt-6 h-2 rounded-full" />
          </div>
        </div>
      </section>

      <section className="container relative z-10 mt-8 grid gap-4 md:grid-cols-3">
        {[
          { icon: BadgeCheck, title: "مشاوره دقیق", text: "انتخاب محصول بر اساس متراژ، مصرف و سطح انتظار شما." },
          { icon: Truck, title: "ارسال و نصب", text: "هماهنگی ساده برای تحویل، نصب و راه‌اندازی دستگاه." },
          { icon: PackageCheck, title: "فیلتر و قطعات", text: "دسترسی به فیلترهای مصرفی و پیگیری سرویس دوره‌ای." }
        ].map((item) => (
          <div key={item.title} className="rounded-lg border border-sky-100 bg-white p-6 shadow-water">
            <span className="flex h-12 w-12 items-center justify-center rounded-md bg-sky-50 text-primary">
              <item.icon className="h-6 w-6" />
            </span>
            <h2 className="mt-4 font-bold text-sky-950">{item.title}</h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.text}</p>
          </div>
        ))}
      </section>

      <section className="container py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-sm font-bold text-primary">
              <Sparkles className="h-4 w-4" />
              پیشنهادهای رادمان
            </p>
            <h2 className="mt-3 text-3xl font-black text-sky-950">محصولات منتخب</h2>
          </div>
          <Button asChild variant="outline">
            <Link href="/products">همه محصولات</Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}
