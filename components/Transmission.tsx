type Props = {
  code: string;
  label?: string;
  className?: string;
};

/**
 * Horizontal divider styled like a Star-Wars-cockpit transmission tag.
 * Mono code on the left, holo dot, Aurebesh decoration on the right.
 */
export default function Transmission({ code, label = "transmission", className = "" }: Props) {
  return (
    <div
      className={`mx-auto flex max-w-[1340px] items-center gap-4 px-5 py-3 md:px-9 ${className}`}
      aria-hidden
    >
      <span className="size-[6px] rounded-full bg-[#7DC4FF] transmit holo" />
      <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-(--color-muted)">
        {label} · {code}
      </span>
      <span className="h-px flex-1 bg-(--color-hairline)" />
      <span className="font-aurebesh text-[12px] tracking-[0.18em] text-(--color-muted-2)">
        luna blades · galactic forge
      </span>
      <span className="size-[6px] rounded-full border border-(--color-hairline-strong)" />
    </div>
  );
}
