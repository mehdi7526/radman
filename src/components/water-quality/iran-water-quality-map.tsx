"use client";

import { useState } from "react";
import Link from "next/link";
import { Droplets, MapPin } from "lucide-react";

type Quality = "good" | "moderate" | "attention" | "poor";
type Province = {
  id: string;
  name: string;
  score: number;
  tds: number;
  ph: number;
  nitrate: number;
  quality: Quality;
};

const provinces: Province[] = [
  ["tehran", "تهران", 64, 530, 7.3, 22, "moderate"],
  ["alborz", "البرز", 66, 500, 7.3, 21, "moderate"],
  ["gilan", "گیلان", 82, 270, 7, 9, "good"],
  ["mazandaran", "مازندران", 79, 300, 7, 10, "good"],
  ["golestan", "گلستان", 67, 480, 7.2, 20, "moderate"],
  ["ardebil", "اردبیل", 78, 310, 7.1, 11, "good"],
  ["azarbaijan-sh", "آذربایجان شرقی", 74, 360, 7.3, 14, "good"],
  ["azarbaijan-gh", "آذربایجان غربی", 71, 410, 7.2, 17, "good"],
  ["zanjan", "زنجان", 72, 400, 7.2, 16, "good"],
  ["ghazvin", "قزوین", 68, 460, 7.3, 20, "moderate"],
  ["kordestan", "کردستان", 76, 340, 7.1, 13, "good"],
  ["kermanshah", "کرمانشاه", 73, 390, 7.2, 15, "good"],
  ["hamedan", "همدان", 70, 420, 7.2, 18, "good"],
  ["ilam", "ایلام", 77, 330, 7.1, 12, "good"],
  ["lorestan", "لرستان", 75, 350, 7.1, 14, "good"],
  ["markazi", "مرکزی", 63, 550, 7.4, 23, "moderate"],
  ["ghom", "قم", 48, 850, 7.7, 35, "poor"],
  ["semnan", "سمنان", 52, 760, 7.5, 31, "attention"],
  ["khorasan-sh", "خراسان شمالی", 69, 440, 7.3, 19, "moderate"],
  ["khorasan-r", "خراسان رضوی", 58, 690, 7.4, 28, "attention"],
  ["khorasan-j", "خراسان جنوبی", 49, 820, 7.6, 34, "poor"],
  ["isfahan", "اصفهان", 54, 730, 7.5, 29, "attention"],
  ["yazd", "یزد", 46, 890, 7.8, 39, "poor"],
  ["kerman", "کرمان", 43, 910, 7.7, 38, "poor"],
  ["sistan", "سیستان و بلوچستان", 47, 880, 7.8, 36, "poor"],
  ["fars", "فارس", 62, 570, 7.4, 24, "moderate"],
  ["kohkilooyeh", "کهگیلویه و بویراحمد", 80, 290, 7, 10, "good"],
  ["charmahal", "چهارمحال و بختیاری", 81, 280, 7, 9, "good"],
  ["khoozestan", "خوزستان", 50, 800, 7.7, 33, "poor"],
  ["booshehr", "بوشهر", 57, 680, 7.6, 27, "attention"],
  ["hormozgan", "هرمزگان", 55, 720, 7.6, 26, "attention"],
].map(([id, name, score, tds, ph, nitrate, quality]) => ({
  id: String(id),
  name: String(name),
  score: Number(score),
  tds: Number(tds),
  ph: Number(ph),
  nitrate: Number(nitrate),
  quality: quality as Quality,
}));

const labels: Record<Quality, string> = {
  good: "مناسب",
  moderate: "متوسط",
  attention: "نیازمند توجه",
  poor: "نیاز جدی به تصفیه",
};
const colors: Record<Quality, string> = {
  good: "fill-emerald-400",
  moderate: "fill-amber-300",
  attention: "fill-orange-400",
  poor: "fill-rose-500",
};

export function IranWaterQualityMap() {
  const [selected, setSelected] = useState(provinces[0]);
  const [hovered, setHovered] = useState<Province | null>(null);
  const active = hovered ?? selected;
  const select = (id: string) =>
    setSelected(
      provinces.find((province) => province.id === id) ?? provinces[0],
    );

  return (
    <section className="bg-[#163548] py-16 text-white md:py-24">
      <div className="container">
        <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_330px] lg:gap-10">
          <div>
            <p className="text-sm font-bold text-amber-200">
              راهنمای نمونه کیفیت آب
            </p>
            <h2 className="mt-3 text-3xl font-black">
              وضعیت آب محل خود را روی نقشه ببینید
            </h2>
            <p className="mt-4 max-w-2xl leading-8 text-white/70">
              برای دیدن جزئیات، روی استان لمس کنید یا از فهرست زیر انتخابش کنید.
              داده‌ها صرفاً نمونه هستند.
            </p>
            <label className="mt-6 block md:hidden">
              <span className="mb-2 block text-sm font-bold">انتخاب استان</span>
              <select
                value={selected.id}
                onChange={(event) => select(event.target.value)}
                className="h-12 w-full rounded-xl border border-white/20 bg-white px-4 font-bold text-foreground outline-none"
              >
                <option value="">انتخاب کنید</option>
                {provinces.map((province) => (
                  <option key={province.id} value={province.id}>
                    {province.name} — {labels[province.quality]}
                  </option>
                ))}
              </select>
            </label>
            <div className="relative -mx-2 mt-5 overflow-hidden rounded-2xl border border-white/15 bg-white/5 px-3 pb-3 pt-2 sm:mx-0 sm:mt-7 sm:rounded-3xl sm:p-6">
              <div className="pointer-events-none absolute inset-x-3 top-3 z-10 flex items-center justify-between rounded-xl bg-slate-950/75 px-3 py-2 text-xs text-white/80 sm:hidden">
                <span>{selected.name}</span>
                <span className="font-bold text-white">
                  {selected.score} از ۱۰۰
                </span>
              </div>
              <svg
                viewBox="0 0 841.89 595.28"
                role="img"
                aria-label="نقشه تعاملی کیفیت نمونه آب استان‌های ایران"
                className="relative left-[40px] h-auto w-[116%] max-w-none -translate-x-[8%] touch-manipulation pt-8 sm:left-0 sm:w-full sm:max-w-full sm:translate-x-0 sm:pt-0"
              >
                <use
                  href="/iran-provinces.svg#map-sea"
                  className="fill-cyan-100/10"
                />
                {provinces.map((province) => (
                  <use
                    key={province.id}
                    href={`/iran-provinces.svg#${province.id}`}
                    className={`cursor-pointer stroke-[#163548] stroke-[2] transition hover:brightness-110 focus:outline-none ${colors[province.quality]} ${selected.id === province.id ? "stroke-white stroke-[4] brightness-110" : ""}`}
                    onMouseEnter={() => setHovered(province)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(province)}
                    onBlur={() => setHovered(null)}
                    onClick={() => setSelected(province)}
                  >
                    <title>{province.name}</title>
                  </use>
                ))}
                <use
                  href="/iran-provinces.svg#map-border"
                  className="pointer-events-none fill-none stroke-white/50 stroke-[2]"
                />
              </svg>
              {hovered ? (
                <div className="pointer-events-none absolute left-3 top-3 hidden rounded-xl bg-slate-950/90 px-4 py-3 text-sm shadow-xl md:block">
                  <p className="font-bold">{hovered.name}</p>
                  <p className="mt-1 text-white/70">
                    کیفیت نمونه: {labels[hovered.quality]} · {hovered.score} از
                    ۱۰۰
                  </p>
                </div>
              ) : null}
            </div>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-white/75 sm:mt-5 sm:gap-x-5 sm:text-sm">
              <span className="flex items-center gap-2">
                <i className="size-3 rounded-full bg-emerald-400" />
                مناسب
              </span>
              <span className="flex items-center gap-2">
                <i className="size-3 rounded-full bg-amber-300" />
                متوسط
              </span>
              <span className="flex items-center gap-2">
                <i className="size-3 rounded-full bg-orange-400" />
                نیازمند توجه
              </span>
              <span className="flex items-center gap-2">
                <i className="size-3 rounded-full bg-rose-500" />
                نیاز جدی به تصفیه
              </span>
            </div>
          </div>
          <aside className="mt-5 rounded-2xl bg-white p-5 text-foreground shadow-lift sm:rounded-3xl sm:p-6 lg:mt-0 lg:h-fit">
            <div className="mb-4 inline-flex rounded-full bg-signal px-3 py-1 text-xs font-bold text-foreground lg:hidden">
              استان انتخاب‌شده
            </div>
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-cyan-50 text-primary">
                <MapPin className="size-5" />
              </div>
              <div>
                <p className="font-black">{selected.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">داده نمونه</p>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4">
              <div>
                <p className="text-sm text-muted-foreground">امتیاز کیفیت آب</p>
                <p className="mt-1 text-4xl font-black text-primary">
                  {selected.score}
                  <span className="text-base">/۱۰۰</span>
                </p>
              </div>
              <p className="rounded-full bg-white px-3 py-2 text-sm font-bold shadow-subtle">
                {labels[selected.quality]}
              </p>
            </div>
            <dl className="mt-5 grid grid-cols-3 gap-2 text-center text-sm">
              <div className="rounded-xl bg-slate-50 p-3">
                <dt className="text-xs text-muted-foreground">TDS</dt>
                <dd className="mt-1 font-bold">{selected.tds}</dd>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <dt className="text-xs text-muted-foreground">pH</dt>
                <dd className="mt-1 font-bold">{selected.ph}</dd>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <dt className="text-xs text-muted-foreground">نیترات</dt>
                <dd className="mt-1 font-bold">{selected.nitrate}</dd>
              </div>
            </dl>
            <Link
              href="/products?category=water-purifier"
              className="mt-5 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white transition hover:bg-atlas"
            >
              <Droplets className="size-4" />
              تصفیه‌کننده‌های مناسب
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
