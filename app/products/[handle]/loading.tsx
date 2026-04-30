export default function PDPLoading() {
  return (
    <div className="border-b border-(--color-hairline) px-5 pt-8 pb-16 md:px-8 md:pt-10 md:pb-20">
      <div className="mx-auto grid max-w-[1230px] gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-14">
        <div className="space-y-3 md:space-y-4">
          <div className="aspect-square animate-pulse rounded-lg bg-(--color-ink-2)" />
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="aspect-square animate-pulse rounded-lg bg-(--color-ink-2)" />
            <div className="aspect-square animate-pulse rounded-lg bg-(--color-ink-2)" />
          </div>
        </div>
        <div className="space-y-5">
          <div>
            <div className="h-3 w-24 animate-pulse rounded-sm bg-(--color-ink-2)" />
            <div className="mt-3 h-10 w-3/4 animate-pulse rounded-sm bg-(--color-ink-2)" />
            <div className="mt-3 h-6 w-32 animate-pulse rounded-sm bg-(--color-ink-2)" />
            <div className="mt-3 h-3 w-40 animate-pulse rounded-sm bg-(--color-ink-2)" />
          </div>
          <div className="h-[420px] animate-pulse rounded-lg bg-(--color-ink-2)" />
          <div className="h-[200px] animate-pulse rounded-lg bg-(--color-ink-2)" />
        </div>
      </div>
    </div>
  );
}
