import { Skeleton } from "@/components/ui/skeleton";

export function HomePageSkeleton() {
  return (
    <>
      <section className="waterfall">
        <div className="container relative grid min-h-[calc(100vh-4rem)] items-center gap-10 py-14 lg:grid-cols-[1fr_430px]">
          <div className="max-w-3xl space-y-6">
            <Skeleton className="h-10 w-72 bg-white/20" />
            <Skeleton className="h-16 w-full max-w-2xl bg-white/20" />
            <Skeleton className="h-16 w-full max-w-xl bg-white/20" />
            <Skeleton className="h-6 w-full max-w-lg bg-white/15" />
            <div className="flex gap-3">
              <Skeleton className="h-12 w-40 bg-white/20" />
              <Skeleton className="h-12 w-32 bg-white/15" />
            </div>
            <div className="grid max-w-2xl gap-3 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-20 bg-white/15" />
              ))}
            </div>
          </div>
          <Skeleton className="h-[420px] rounded-lg bg-white/20" />
        </div>
      </section>

      <section className="container relative z-10 mt-8 grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-white p-6">
            <Skeleton className="h-12 w-12" />
            <Skeleton className="mt-4 h-5 w-32" />
            <Skeleton className="mt-3 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-4/5" />
          </div>
        ))}
      </section>

      <section className="container space-y-8 py-16">
        <div className="flex items-end justify-between">
          <div className="space-y-3">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-48" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <ProductGridSkeleton count={3} />
      </section>
    </>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      <Skeleton className="aspect-[4/3] rounded-none" />
      <div className="space-y-4 p-5">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

export function ProductListPageSkeleton() {
  return (
    <div className="container space-y-8 py-12">
      <div className="rounded-lg border bg-white/80 p-8">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="mt-3 h-10 w-72" />
        <Skeleton className="mt-4 h-5 w-full max-w-3xl" />
      </div>
      <div className="grid gap-3 rounded-lg border bg-white p-4 lg:grid-cols-[1fr_180px_140px_140px_140px_auto]">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10" />
        ))}
      </div>
      <ProductGridSkeleton />
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="container grid gap-10 py-12 lg:grid-cols-[1fr_440px]">
      <div className="space-y-4">
        <Skeleton className="aspect-[4/3] rounded-lg" />
        <div className="rounded-lg border bg-white p-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="mt-4 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-4/5" />
        </div>
      </div>
      <aside className="h-fit space-y-4 rounded-lg border bg-white p-6">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-px w-full" />
        <div className="flex justify-between">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-8 w-32" />
        </div>
        <Skeleton className="h-12 w-full" />
      </aside>
    </div>
  );
}

export function CartPageSkeleton() {
  return (
    <div className="container grid gap-8 py-12 lg:grid-cols-[1fr_360px]">
      <section className="space-y-4">
        <Skeleton className="h-10 w-40" />
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="grid gap-4 rounded-lg border bg-white p-4 sm:grid-cols-[120px_1fr_auto]">
            <Skeleton className="aspect-square" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
            <Skeleton className="h-6 w-20" />
          </div>
        ))}
      </section>
      <aside className="h-fit rounded-lg border bg-white p-6">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="mt-2 h-10 w-32" />
        <Skeleton className="mt-6 h-11 w-full" />
      </aside>
    </div>
  );
}

export function CheckoutPageSkeleton() {
  return (
    <div className="container grid gap-8 py-12 lg:grid-cols-[1fr_380px]">
      <div className="space-y-5 rounded-lg border bg-white p-6">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-11" />
          <Skeleton className="h-11" />
        </div>
        <Skeleton className="h-11" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
      <aside className="space-y-4 rounded-lg border bg-white p-6">
        <Skeleton className="h-6 w-28" />
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex gap-3 border-b pb-4">
            <Skeleton className="h-16 w-16 shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        ))}
        <Skeleton className="h-8 w-full" />
      </aside>
    </div>
  );
}

export function ResultPageSkeleton() {
  return (
    <div className="container flex min-h-[60vh] items-center justify-center py-12">
      <div className="w-full max-w-xl space-y-4 rounded-lg border bg-white p-8 text-center">
        <Skeleton className="mx-auto h-16 w-16 rounded-full" />
        <Skeleton className="mx-auto h-10 w-64" />
        <Skeleton className="mx-auto h-20 w-full max-w-sm" />
        <Skeleton className="mx-auto h-11 w-40" />
      </div>
    </div>
  );
}

export function TrackPageSkeleton() {
  return (
    <div className="container max-w-2xl space-y-6 py-12">
      <div className="space-y-2">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="space-y-4 rounded-lg border bg-white p-5">
        <Skeleton className="h-11" />
        <Skeleton className="h-11" />
        <Skeleton className="h-11 w-full" />
      </div>
    </div>
  );
}

export function FormCardSkeleton() {
  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-md space-y-4 rounded-lg border bg-white p-6 shadow-water">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="mt-4 h-11 w-full" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
      </div>
    </div>
  );
}

export function AccountPageSkeleton() {
  return (
    <div className="container space-y-8 py-12">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-10 w-20" />
      </div>
      <div className="rounded-lg border bg-white p-5">
        <Skeleton className="h-6 w-20" />
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Skeleton className="h-11" />
          <Skeleton className="h-11" />
        </div>
      </div>
      <div className="rounded-lg border bg-white p-5">
        <Skeleton className="h-6 w-32" />
        <div className="mt-4 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function OrderDetailSkeleton() {
  return (
    <div className="container space-y-6 py-12">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>
      <div className="space-y-4 rounded-lg border bg-white p-5">
        <div className="flex justify-between">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="rounded-lg border bg-white p-5">
        <Skeleton className="h-6 w-16" />
        <div className="mt-4 space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-5 w-full" />
          ))}
        </div>
        <Skeleton className="mt-4 h-8 w-40" />
      </div>
    </div>
  );
}

export function AdminSidebarSkeleton() {
  return (
    <aside className="h-fit space-y-4 rounded-lg border bg-white p-4">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-6 w-20" />
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
      <Skeleton className="h-10 w-full" />
    </aside>
  );
}

export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-56" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-lg" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-64 rounded-lg" />
        <Skeleton className="h-64 rounded-lg" />
      </div>
      <Skeleton className="h-72 rounded-lg" />
    </div>
  );
}

export function AdminListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      <Skeleton className="h-16 w-full rounded-lg" />
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export function AdminFormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="space-y-4 rounded-lg border bg-white p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-11" />
          <Skeleton className="h-11" />
        </div>
        <Skeleton className="h-11" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-11 w-32" />
      </div>
    </div>
  );
}
