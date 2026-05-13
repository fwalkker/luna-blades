/**
 * Three-up dark cards. Big icon + heading + body copy.
 */
export default function FeatureTriplet() {
  const cards = [
    {
      icon: <Bolt />,
      title: "Combat-rated",
      body: "Reinforced 3mm polycarbonate wall, brass-threaded emitter, recessed switch geometry. Built for full-contact dueling.",
    },
    {
      icon: <Audio />,
      title: "Motion-reactive",
      body: "Onboard 3W hi-fi speaker with clash, swing, and ignition detection. Ten sound fonts, switchable in-hilt.",
    },
    {
      icon: <Charge />,
      title: "USB-C, ready to go",
      body: "Charges in 90 minutes. Cycle twelve colors, ten sound fonts, and three brightness levels with the hilt button — no app, no pairing.",
    },
  ];
  return (
    <section className="px-5 py-20 md:px-8 md:py-24">
      <div className="mx-auto max-w-[1230px]">
        <div className="grid gap-3 md:grid-cols-3 md:gap-5">
          {cards.map((c) => (
            <article
              key={c.title}
              className="rounded-lg border border-(--color-hairline) bg-(--color-ink-2) p-7 md:p-9"
            >
              <span className="inline-grid h-12 w-12 place-items-center rounded-full border border-(--color-blue) bg-(--color-blue)/15 text-(--color-blue)">
                {c.icon}
              </span>
              <h3 className="font-display mt-6 text-[22px] uppercase tracking-tight md:text-[26px]">
                {c.title}
              </h3>
              <p className="mt-3 max-w-[34ch] text-[14px] leading-relaxed text-(--color-bone-soft)">
                {c.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Bolt() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
    </svg>
  );
}
function Audio() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 4v16M8 8v8M16 8v8M4 11v2M20 11v2" strokeLinecap="round" />
    </svg>
  );
}
function Charge() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="2" y="9" width="16" height="6" rx="1" />
      <path d="M18 11h2a1 1 0 0 1 1 1v0a1 1 0 0 1-1 1h-2" />
      <path d="M5 12h6" />
    </svg>
  );
}
