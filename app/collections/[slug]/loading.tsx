export default function CollectionLoading() {
  return (
    <article>
      <section className="border-b border-(--color-hairline) px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-[1230px]">
          <div className="h-3 w-32 animate-pulse rounded-sm bg-(--color-ink-2)" />
          <div className="mt-5 h-16 w-2/3 animate-pulse rounded-sm bg-(--color-ink-2) md:h-24" />
          <div className="mt-6 h-4 w-1/2 animate-pulse rounded-sm bg-(--color-ink-2)" />
        </div>
      </section>
      <section className="px-5 py-20 md:px-8">
        <div className="mx-auto grid max-w-[1230px] gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[4/5] animate-pulse rounded-lg bg-(--color-ink-2)"
            />
          ))}
        </div>
      </section>
    </article>
  );
}
