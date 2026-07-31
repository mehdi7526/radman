import Link from "next/link";
import { ArrowLeft, Droplets, PackageCheck, ShieldCheck, Truck, Wind } from "lucide-react";
import { BrandDivider } from "@/components/brand/brand-divider";
import { LogoMark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/product-card";
import { brand } from "@/lib/brand";
import { getCachedFeaturedProducts } from "@/lib/queries/products";

export const revalidate = 60;

function BrandShowcase() {
  return (
    <div className="relative mx-auto w-full max-w-[30rem]">
      <div className="absolute -inset-10 rounded-full bg-cyan-300/20 blur-3xl" aria-hidden="true" />
      <div className="relative min-h-[32rem] overflow-hidden rounded-[2.5rem] border border-white/25 bg-white/10 p-5 shadow-2xl backdrop-blur-xl sm:aspect-square sm:min-h-0">
        <div className="absolute inset-7 rounded-full border border-cyan-100/20" aria-hidden="true" />
        <div className="absolute inset-14 rounded-full border border-dashed border-amber-100/30" aria-hidden="true" />
        <div className="absolute left-[18%] top-[18%] size-3 rounded-full bg-cyan-100/80 shadow-[0_0_24px_8px_rgba(186,230,253,0.25)]" aria-hidden="true" />
        <div className="absolute bottom-[21%] right-[17%] size-4 rounded-full bg-amber-200/80 shadow-[0_0_24px_8px_rgba(253,230,138,0.2)]" aria-hidden="true" />
        <div className="relative flex h-full flex-col items-center justify-center text-center">
          <div className="rounded-[2rem] border border-white/35 bg-white/15 p-4 shadow-xl backdrop-blur-sm">
            <LogoMark size="xl" priority className="rounded-[1.45rem]" />
          </div>
          <p className="mt-6 text-sm font-bold tracking-[0.28em] text-amber-100">{brand.nameEn}</p>
          <p className="mt-2 max-w-56 text-sm leading-7 text-white/65">هوای پاک و آب سالم، برای زندگی آرام‌تر.</p>
        </div>
        <div className="absolute right-4 top-4 rounded-2xl border border-white/30 bg-white/90 px-4 py-3 text-slate-800 shadow-xl backdrop-blur" dir="rtl">
          <p className="text-[11px] font-bold text-slate-500">استاندارد تصفیه</p>
          <p className="mt-1 text-sm font-extrabold">RO + HEPA</p>
        </div>
        <div className="hidden" dir="rtl">
          <p className="text-[11px] font-bold opacity-70">خدمت رادمان</p>
          <p className="mt-1 text-base font-extrabold">مشاوره تا نصب</p>
        </div>
      </div>
    </div>
  );
}

export default async function HomePage() {
  const products = await getCachedFeaturedProducts();

  return (
    <>
      <section aria-labelledby="hero-heading" className="relative isolate overflow-hidden bg-[#163548] text-white">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_45%,rgba(111,197,202,0.36),transparent_23rem),radial-gradient(circle_at_8%_4%,rgba(242,196,129,0.2),transparent_26rem)]" />
        <div className="container grid min-h-[calc(100dvh-4.5rem)] items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div className="max-w-2xl">
            <p className="inline-flex rounded-full border border-amber-200/25 bg-white/10 px-4 py-2 text-xs font-bold tracking-[0.14em] text-amber-100">{brand.taglineEn}</p>
            <h1 id="hero-heading" className="mt-5 text-balance text-4xl font-bold leading-[1.48] xs:text-5xl lg:text-[3.25rem]">
              هوای خانه و آب آشامیدنی‌تان را با اطمینان انتخاب کنید.
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-base leading-9 text-white/75 md:text-lg">
              راهکارهای تصفیه آب و هوا برای خانه و محل کار؛ با انتخاب شفاف، نصب هماهنگ و پشتیبانی برای زمان تعویض فیلتر.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="accent">
                <Link href="/products">مشاهده محصولات <ArrowLeft className="size-5" aria-hidden="true" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" sx={{ borderColor: "#91c9cf", backgroundColor: "#91c9cf", color: "#123548", "&:hover": { borderColor: "#b3dce0", backgroundColor: "#b3dce0" } }}>
                <Link href="/track">پیگیری سفارش</Link>
              </Button>
            </div>
            <dl className="mt-10 grid gap-3 sm:grid-cols-3">
              {[['۲۴', 'ساعت', 'آماده‌سازی سفارش'], ['HEPA', 'کلاس', 'تصفیه هوای داخل'], ['RO', 'ممبران', 'تصفیه آب خانه']].map(([value, unit, label]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 backdrop-blur-sm">
                  <dt className="text-xs text-white/55">{label}</dt>
                  <dd className="mt-1 flex items-baseline gap-2"><span className="text-2xl font-bold tabular-nums">{value}</span><span className="text-xs text-white/60">{unit}</span></dd>
                </div>
              ))}
            </dl>
          </div>
          <BrandShowcase />
        </div>
      </section>

      <section aria-label="مزیت‌های خرید از رادمان" className="relative -mt-8 z-10">
        <div className="container grid gap-4 md:grid-cols-3">
          {[{ icon: ShieldCheck, title: 'انتخاب مطمئن', text: 'مشخصات روشن برای انتخاب آگاهانه' }, { icon: Truck, title: 'ارسال و نصب', text: 'هماهنگی تحویل و راه‌اندازی محصول' }, { icon: PackageCheck, title: 'پشتیبانی فیلتر', text: 'همراهی برای تهیه قطعات مصرفی' }].map((item) => (
            <div key={item.title} className="flex items-center gap-4 rounded-2xl border border-border bg-white p-5 shadow-lift">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-50 text-oxygen"><item.icon className="size-6" aria-hidden="true" /></div>
              <div><h2 className="font-bold text-foreground">{item.title}</h2><p className="mt-1 text-sm text-muted-foreground">{item.text}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="container py-16 md:py-24">
        <div className="grid gap-6 md:grid-cols-2">
          {[{ href: '/products?category=water-purifier', icon: Droplets, kicker: 'آب سالم برای هر روز', title: 'تصفیه آب', text: 'دستگاه‌های RO و فیلترهای مصرفی برای آشپزخانه و محل کار.' }, { href: '/products?category=air-purifier', icon: Wind, kicker: 'نفس راحت‌تر در خانه', title: 'تصفیه هوا', text: 'تصفیه‌کننده‌های HEPA برای اتاق، پذیرایی و فضای کاری.' }].map((category, index) => (
            <Link key={category.href} href={category.href} className={`group relative overflow-hidden rounded-3xl border p-8 transition duration-200 hover:-translate-y-1 hover:shadow-lift ${index === 0 ? 'border-[#287d90] bg-[#0f6275]' : 'border-[#365f80] bg-[#1d3f5d]'}`}>
              <div className="absolute -left-12 -top-12 size-44 rounded-full bg-white/5" aria-hidden="true" />
              <category.icon className="relative size-10 text-cyan-100" aria-hidden="true" />
              <p className="relative mt-12 text-sm font-bold text-cyan-100/80">{category.kicker}</p>
              <h2 className="relative mt-2 text-3xl font-bold text-white">{category.title}</h2>
              <p className="relative mt-3 max-w-sm leading-8 text-white/70">{category.text}</p>
              <span className="relative mt-7 inline-flex items-center gap-2 font-bold text-amber-100">مشاهده محصولات <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" /></span>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="featured-heading" className="bg-white py-16 md:py-24">
        <div className="container">
          <BrandDivider className="mb-8" />
          <div className="mb-16 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="eyebrow">پیشنهاد رادمان</p><h2 id="featured-heading" className="mt-2 text-3xl font-bold text-foreground">محصولات منتخب</h2></div>
            <Button asChild variant="outline"><Link href="/products">همه محصولات</Link></Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      </section>
    </>
  );
}
