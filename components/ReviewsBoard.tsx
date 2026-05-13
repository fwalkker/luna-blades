"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { REVIEW_GALLERY_PHOTOS, getReviewPhotos } from "@/lib/placeholder-media";
import MediaModal from "./MediaModal";

type Review = {
  name: string;
  flag: string;
  date: string;
  rating: number;
  title: string;
  body: string;
};

type Question = {
  name: string;
  date: string;
  question: string;
  answer?: string;
  answeredBy?: string;
  answeredAt?: string;
};

const SUMMARY = {
  avg: 4.75,
  total: 228,
  distribution: [
    { star: 5, count: 191 },
    { star: 4, count: 24 },
    { star: 3, count: 9 },
    { star: 2, count: 1 },
    { star: 1, count: 3 },
  ],
};

const REVIEWS: Review[] = [
  { name: "Alex A.",     flag: "🇺🇸", date: "02/02/2026", rating: 5, title: "Coolest thing I own.",       body: "Genuinely the coolest thing I own. This is the fourth pixel saber I've bought and the second one from Luna. Absolutely incredible. The way it looks and feels, the quality, the everything. The kyber-look pommel is insanely cool and the sound profiles are the best I've ever used. Would buy again tomorrow." },
  { name: "Marcus T.",   flag: "🇨🇦", date: "01/24/2026", rating: 5, title: "Worth every dollar.",        body: "Was deciding between three other brands. Picked Luna because of the lifetime blade thing. Six months in, I've dueled this saber easily a hundred times and it looks brand new. The hilt has real weight in the hand and the matte anodizing hasn't shown a scratch." },
  { name: "Sarah R.",    flag: "🇺🇸", date: "12/19/2025", rating: 5, title: "Perfect Christmas gift.",    body: "Got this for my fiancé who's been into Star Wars since he was eight. He cried a little. The packaging alone made me feel like I picked the right thing — foam-cut case, hand-stamped card, the whole bit." },
  { name: "Devin K.",    flag: "🇬🇧", date: "11/03/2025", rating: 5, title: "Best in class.",             body: "I've owned three sabers from other brands. This is the first one where the hum actually sounds right and the colors don't look like a $20 toy. Charges fast, button controls are dead simple, LEDs are evenly bright top to bottom." },
  { name: "Olivia P.",   flag: "🇦🇺", date: "10/14/2025", rating: 5, title: "Even better than I hoped.",  body: "I know nothing about lightsabers. The site explained everything I needed and the saber arrived in two days. My nephew said it was the best gift he's ever gotten — and I look like a hero." },
  { name: "Tariq S.",    flag: "🇩🇪", date: "09/28/2025", rating: 5, title: "Outstanding build.",         body: "Hilt machining is top-tier. The threading on the pommel is tight, the switch has no wobble, and the speaker is louder than I expected. Spent an hour just turning it on and off." },
  { name: "Priya N.",    flag: "🇮🇳", date: "09/02/2025", rating: 4, title: "Great, with one note.",      body: "Love it overall. Knocked one star off because the button gestures took me a few sessions to memorize — there's a learning curve for the color and font switches. Once you've got it, it's intuitive. Saber itself is incredible." },
  { name: "Connor B.",   flag: "🇮🇪", date: "08/19/2025", rating: 5, title: "My third saber from Luna.",  body: "I keep coming back. Every model I've owned has held up to heavy use. Lifetime blade replacement is real — they sent me a new blade after six months with no questions when one cracked at a meetup." },
  { name: "Hannah W.",   flag: "🇨🇦", date: "07/30/2025", rating: 5, title: "Came in perfect shape.",     body: "Box was exactly as pictured, hilt was wrapped, blade was protected. Charged in about an hour and fired up first try. Beautiful product." },
  { name: "Jonas R.",    flag: "🇩🇰", date: "07/12/2025", rating: 5, title: "Excellent quality control.", body: "Inspected every part of the hilt before lighting it up. Clean machining, even anodizing, no loose components. The pommel kyber-look detail is even better in person." },
  { name: "Mira T.",     flag: "🇪🇸", date: "06/28/2025", rating: 5, title: "Better than expected.",      body: "Ordered the pixel version. The blade brightness in a dark room is genuinely cinematic. Friends keep asking where I got it." },
  { name: "Brandon L.",  flag: "🇺🇸", date: "06/15/2025", rating: 4, title: "Solid all around.",          body: "Took a week to learn all the button gestures, but once you do, the controls are intuitive. Sound fonts are varied and the animation effects are well-tuned." },
  { name: "Yuki H.",     flag: "🇯🇵", date: "05/29/2025", rating: 5, title: "Beautiful in person.",       body: "Photos don't do it justice. The hilt has subtle machining details you only see when you're holding it. Very happy with the purchase." },
  { name: "Felix G.",    flag: "🇫🇷", date: "05/12/2025", rating: 5, title: "Sound is the highlight.",    body: "I expected the lights to be the best part but the sound design is what stands out. Clash detection is precise and the swing audio is layered, not just a hum loop." },
  { name: "Naomi K.",    flag: "🇳🇿", date: "04/24/2025", rating: 5, title: "Customer service is great.", body: "Had a question about charging before ordering and got a real reply within a few hours. Bought the next day. The saber is everything I hoped for." },
  { name: "Dmitri V.",   flag: "🇵🇱", date: "04/08/2025", rating: 4, title: "Heavier than I thought.",    body: "If you've never held a real metal saber, you'll be surprised how much it weighs. After a week of practice my wrist got used to it. Build quality justifies the heft." },
  { name: "Aisha M.",    flag: "🇦🇪", date: "03/22/2025", rating: 5, title: "Gift for my brother.",       body: "He's been a Star Wars fan his whole life. Said this was the best gift he's ever received. Worth every dollar to see his reaction." },
  { name: "Logan W.",    flag: "🇨🇦", date: "03/05/2025", rating: 5, title: "Held up to a year of duels.", body: "Use this for weekly stage practice with a local saber group. After a year of contact strikes there's not a crack on the blade. Hilt finish is mostly intact too." },
];

const QUESTIONS: Question[] = [
  { name: "Jordan",  date: "02/14/2026", question: "Can I duel with this saber out of the box, or do I need a different blade?",
    answer: "You can duel with it as shipped. Every saber comes with a 3mm dueling-grade polycarbonate blade — the combat-rated default. No upgrade needed unless you want a longer or shorter length.", answeredBy: "Luna Support", answeredAt: "02/14/2026" },
  { name: "Sam",     date: "02/09/2026", question: "How long does the battery last on a single charge?",
    answer: "Roughly 5 hours of active use, longer at a lower brightness level. Charges from empty in about 90 minutes via USB-C.", answeredBy: "Luna Support", answeredAt: "02/09/2026" },
  { name: "Rachel",  date: "01/30/2026", question: "Is this safe for a 10-year-old to use?",
    answer: "We recommend ages 12+ for full duels and unsupervised use. Younger kids love the lights and sounds and can hold it safely — just supervise the swinging. The hilt has real weight, so two-handed grip works best for smaller hands.", answeredBy: "Luna Support", answeredAt: "01/30/2026" },
  { name: "Kai",     date: "01/22/2026", question: "How does the lifetime blade replacement work?",
    answer: "If your blade ever cracks, send a photo to hello@lunablades.com and we'll mail a replacement. Once per year, on us. No questions about how it broke.", answeredBy: "Luna Support", answeredAt: "01/22/2026" },
  { name: "Priya",   date: "01/15/2026", question: "Are the sound fonts customizable?",
    answer: "Yes. Ten ship pre-loaded, and you can sideload your own over USB-C — drag-and-drop a .wav set into the saber's profile folder when it's plugged into your computer. We host a small community library of fan-made fonts on our site.", answeredBy: "Luna Support", answeredAt: "01/15/2026" },
  { name: "Marcus",  date: "01/08/2026", question: "Will this ship to Australia?",
    answer: "Yes. Free shipping over $99 to almost everywhere — Australia included. Delivery is usually 5–9 business days from when it leaves our Long Beach workshop.", answeredBy: "Luna Support", answeredAt: "01/08/2026" },
  { name: "Olivia",  date: "12/29/2025", question: "Can two of us duel with sabers from this collection?",
    answer: "Yes — every model uses the same blade spec, so any pair from the rack will hold up to contact dueling. The Twin-Blade Bundle saves 20% on a pair.", answeredBy: "Luna Support", answeredAt: "12/29/2025" },
  { name: "Theo",    date: "12/14/2025", question: "What's the difference between DuraBlade, Pixel, and Proffie?",
    answer: "DuraBlade is our entry-level core (single LED in the emitter, 5 sound fonts). Pixel uses an addressable LED strip down the full blade with animated effects (12 colors, 10 fonts). Proffie is for advanced users — open firmware, sideloadable, fully programmable.", answeredBy: "Luna Support", answeredAt: "12/14/2025" },
  { name: "Lara",    date: "11/30/2025", question: "Do you offer gift wrapping?",
    answer: "Yes — at checkout, tick \"Gift wrap\" and we'll seal the case in matte black wrap with a Luna ribbon. Free over $99, $9 below.", answeredBy: "Luna Support", answeredAt: "11/30/2025" },
  { name: "Brandon", date: "11/18/2025", question: "Can I replace the battery myself?",
    answer: "Yes. The 18650 cell is held in a tray under the threaded pommel — unscrew, swap, screw it back in. We sell replacement cells for $14 if you ever need one.", answeredBy: "Luna Support", answeredAt: "11/18/2025" },
  { name: "Naomi",   date: "11/02/2025", question: "How do I change the blade color?",
    answer: "Press and hold the main button for two seconds to enter color-change mode, then tap to cycle through the twelve presets. Release to lock it in — the new color holds across reboots.", answeredBy: "Luna Support", answeredAt: "11/02/2025" },
  { name: "Felix",   date: "10/19/2025", question: "Is the hilt scratch-resistant?",
    answer: "The matte black anodizing is hard but not invincible. Heavy contact with another saber will leave faint marks over time. The brass choke point patinas naturally — owners tend to like that.", answeredBy: "Luna Support", answeredAt: "10/19/2025" },
];

const PAGE_SIZE = 4;

export default function ReviewsBoard() {
  const [tab, setTab] = useState<"reviews" | "questions">("reviews");
  const [sort, setSort] = useState<"pictures" | "recent" | "highest" | "lowest">("pictures");
  const [query, setQuery] = useState<string>("");
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [page, setPage] = useState(1);
  const [filterStar, setFilterStar] = useState<number | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [activeForm, setActiveForm] = useState<null | "review" | "question">(null);

  const filtered = useMemo(() => {
    let list = REVIEWS;
    if (filterStar) list = list.filter((r) => r.rating === filterStar);
    if (query)
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(query.toLowerCase()) ||
          r.body.toLowerCase().includes(query.toLowerCase()) ||
          r.name.toLowerCase().includes(query.toLowerCase())
      );
    if (sort === "highest") list = [...list].sort((a, b) => b.rating - a.rating);
    if (sort === "lowest") list = [...list].sort((a, b) => a.rating - b.rating);
    if (sort === "recent")
      list = [...list].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return list;
  }, [query, sort, filterStar]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const slice = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const totalBars = SUMMARY.distribution.reduce((s, d) => s + d.count, 0);

  return (
    <section id="reviews" className="border-t border-(--color-hairline) bg-(--color-ink) px-5 py-20 md:px-8 md:py-24">
      <div className="mx-auto max-w-[1230px]">
        <h2 className="text-center font-display text-[24px] uppercase tracking-tight md:text-[32px]">
          Customer Reviews
        </h2>

        {/* 3-column summary header */}
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-[1fr_1.2fr_auto] md:items-center md:gap-10">
          <a
            href="#reviews"
            className="md:border-r md:border-(--color-blue)/30 md:pr-10 md:text-right"
          >
            <div className="flex items-center gap-2 md:justify-end">
              <Stars n={Math.round(SUMMARY.avg)} />
              <span className="text-[15px] underline-offset-2 hover:underline">
                {SUMMARY.avg.toFixed(2)} out of 5
              </span>
            </div>
            <p className="mt-1 text-[13px] text-(--color-bone-soft) md:text-right">
              Based on 400+ reviews
            </p>
          </a>

          <ul className="space-y-1.5 md:border-r md:border-(--color-blue)/30 md:px-10">
            {SUMMARY.distribution.map((d) => {
              const pct = (d.count / totalBars) * 100;
              const active = filterStar === d.star;
              return (
                <li key={d.star}>
                  <button
                    onClick={() => {
                      setFilterStar(active ? null : d.star);
                      setPage(1);
                    }}
                    className={`grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 rounded px-2 py-1 text-left transition ${
                      active ? "bg-(--color-blue)/10" : "hover:bg-(--color-hairline)"
                    }`}
                    aria-label={`Filter by ${d.star} star reviews`}
                  >
                    <Stars n={d.star} small />
                    <div className="h-[10px] overflow-hidden rounded-full bg-(--color-surface-2)">
                      <div className="h-full bg-(--color-blue)" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="font-mono text-[12px] tabular-nums text-(--color-bone-soft)">
                      {d.count}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="flex flex-col gap-2 md:pl-4">
            <button
              onClick={() => setActiveForm((m) => (m === "review" ? null : "review"))}
              aria-expanded={activeForm === "review"}
              className="rounded-full border border-(--color-bone) bg-(--color-bone) px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.16em] text-(--color-ink) transition hover:bg-[#ededed]"
            >
              Write a review
            </button>
            <button
              onClick={() => setActiveForm((m) => (m === "question" ? null : "question"))}
              aria-expanded={activeForm === "question"}
              className="rounded-full border border-(--color-bone) bg-transparent px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.16em] text-(--color-bone) transition hover:bg-(--color-bone) hover:text-(--color-ink)"
            >
              Ask a question
            </button>
          </div>
        </div>

        {/* Inline form panel — appears below the summary, replaces the list flow visually */}
        {activeForm === "review" && (
          <ReviewForm onClose={() => setActiveForm(null)} />
        )}
        {activeForm === "question" && (
          <QuestionForm onClose={() => setActiveForm(null)} />
        )}

        {/* Active filter chip */}
        {filterStar !== null && activeForm === null && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => {
                setFilterStar(null);
                setPage(1);
              }}
              className="inline-flex items-center gap-2 rounded-full border border-(--color-blue)/40 bg-(--color-blue)/10 px-4 py-2 text-[12px] uppercase tracking-[0.18em] text-(--color-blue)"
            >
              Showing {filterStar}-star only
              <span aria-hidden>×</span>
            </button>
          </div>
        )}

        {/* Photos & videos row */}
        {activeForm === null && (
          <div className="mt-10 grid grid-cols-1 gap-6 border-t border-(--color-hairline) pt-8 md:grid-cols-[1fr_auto] md:items-center md:gap-10">
            <div>
              <p className="text-[14px] text-(--color-muted)">Customer photos &amp; videos</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {REVIEW_GALLERY_PHOTOS.map((src, i) => (
                  <li key={src + i}>
                    <button
                      onClick={() => setLightbox(src)}
                      aria-label={`View customer photo ${i + 1}`}
                      className="relative block size-[64px] overflow-hidden rounded-md border border-(--color-hairline) bg-(--color-ink-2) transition hover:border-(--color-hairline-strong)"
                    >
                      <Image
                        src={src}
                        alt=""
                        fill
                        sizes="64px"
                        className="object-cover"
                        loading="lazy"
                      />
                      {i === 0 && (
                        <span className="absolute bottom-1 left-1 grid size-4 place-items-center rounded-full bg-black/70 text-white">
                          <svg width="9" height="9" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M5 3v10l9-5L5 3Z" />
                          </svg>
                        </span>
                      )}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={() => setLightbox(REVIEW_GALLERY_PHOTOS[0])}
                    className="grid size-[64px] place-items-center rounded-md border border-(--color-hairline) bg-(--color-ink-2) text-[10px] uppercase tracking-[0.18em] text-(--color-bone-soft) transition hover:border-(--color-hairline-strong)"
                  >
                    See more
                  </button>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setActiveForm("question")}
              aria-label="Verified Transparency — learn more"
              className="grid size-[110px] place-items-center rounded-md border border-(--color-blue)/40 bg-(--color-ink-2) text-center transition hover:border-(--color-blue)"
            >
              <div>
                <span className="text-[18px]">🛡</span>
                <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.18em] text-(--color-blue)">
                  Verified
                  <br /> Transparency
                </p>
                <p className="mt-1 font-mono text-[11px] tabular-nums text-(--color-bone-soft)">86.0</p>
              </div>
            </button>
          </div>
        )}

        {/* Search */}
        {activeForm === null && (
          <div className="mt-8 flex justify-center">
            <div className="flex w-full max-w-[640px] items-center rounded-full border border-(--color-hairline-strong) bg-(--color-ink-2) px-5 py-3">
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                type="text"
                placeholder="Search"
                className="w-full bg-transparent text-[14px] text-(--color-bone) outline-none placeholder:text-(--color-muted)"
              />
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-(--color-bone-soft)"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </div>
          </div>
        )}

        {/* Tabs */}
        {activeForm === null && (
          <div className="mt-8 flex items-center gap-6 border-b border-(--color-hairline) pb-2">
            <button
              onClick={() => setTab("reviews")}
              className={`rounded-full px-5 py-2 text-[13px] font-semibold transition ${
                tab === "reviews"
                  ? "bg-(--color-blue) text-white"
                  : "text-(--color-bone-soft) hover:text-(--color-bone)"
              }`}
            >
              Reviews (400+)
            </button>
            <button
              onClick={() => setTab("questions")}
              className={`rounded-full px-5 py-2 text-[13px] font-semibold transition ${
                tab === "questions"
                  ? "bg-(--color-blue) text-white"
                  : "text-(--color-bone-soft) hover:text-(--color-bone)"
              }`}
            >
              Questions ({QUESTIONS.length})
            </button>
          </div>
        )}

        {activeForm === null && tab === "reviews" && (
          <>
            <div className="mt-6 flex items-center gap-3">
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value as typeof sort);
                  setPage(1);
                }}
                className="rounded-md border border-(--color-hairline) bg-(--color-ink-2) px-3 py-2 text-[13px] text-(--color-bone) outline-none transition focus:border-(--color-blue)"
              >
                <option value="pictures">Pictures First</option>
                <option value="recent">Most Recent</option>
                <option value="highest">Highest Rated</option>
                <option value="lowest">Lowest Rated</option>
              </select>
            </div>

            {slice.length === 0 ? (
              <p className="mt-12 text-center text-[14px] text-(--color-muted)">
                No reviews match your filter.
              </p>
            ) : (
              <ul className="mt-8 space-y-10">
                {slice.map((r, i) => {
                  const reviewId = (safePage - 1) * PAGE_SIZE + i;
                  const isOpen = !!expanded[reviewId];
                  return (
                    <li key={r.name + r.date} className="border-t border-(--color-hairline) pt-7">
                      <ReviewItem
                        r={r}
                        photos={getReviewPhotos(reviewId, 4)}
                        isOpen={isOpen}
                        onToggle={() => setExpanded((s) => ({ ...s, [reviewId]: !s[reviewId] }))}
                        onPhotoClick={(src) => setLightbox(src)}
                      />
                    </li>
                  );
                })}
              </ul>
            )}

            {totalPages > 1 && <Pagination total={totalPages} current={safePage} onChange={setPage} />}
          </>
        )}

        {activeForm === null && tab === "questions" && (
          <QuestionList onAsk={() => setActiveForm("question")} />
        )}
      </div>

      <MediaModal open={!!lightbox} onClose={() => setLightbox(null)} image={lightbox || undefined} />
    </section>
  );
}

/* ============== Review form (inline) ============== */

function ReviewForm({ onClose }: { onClose: () => void }) {
  const [rating, setRating] = useState<number>(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [youtube, setYoutube] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <SubmitSuccess
        heading="Thanks for the review."
        body={`We'll publish it once it clears moderation — usually within a day. If you uploaded a photo, it'll show up here too.`}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="mt-10 border-t border-(--color-hairline) pt-10">
      <header className="text-center">
        <h3 className="font-display text-[24px] uppercase tracking-tight md:text-[28px]">Write a review</h3>
        <button
          onClick={onClose}
          className="mt-2 text-[12px] uppercase tracking-[0.2em] text-(--color-bone-soft) underline-offset-2 hover:underline"
        >
          Cancel
        </button>
      </header>

      <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-[640px] space-y-7 text-center">
        <Field label="Rating" required>
          <div className="flex justify-center gap-2 pt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setRating(i + 1)}
                aria-label={`Rate ${i + 1} out of 5`}
                className="transition hover:scale-110"
              >
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill={i < rating ? "var(--color-blue)" : "none"}
                  stroke="var(--color-blue)"
                  strokeWidth="1.5"
                >
                  <path d="M12 2 14.6 8.6 22 9.3l-5.5 5 1.7 7.4L12 17.9 5.8 21.7l1.7-7.4-5.5-5 7.4-.7Z" />
                </svg>
              </button>
            ))}
          </div>
        </Field>

        <Field label="Review title" required>
          <PillInput value={title} onChange={setTitle} placeholder="Give your review a title" required />
        </Field>

        <Field label="Review content" required>
          <PillTextarea value={body} onChange={setBody} placeholder="Start writing here…" required rows={6} />
        </Field>

        <Field label="Picture or video (optional)">
          <label className="mx-auto grid size-[140px] cursor-pointer place-items-center rounded-lg border-2 border-dashed border-(--color-hairline-strong) bg-(--color-ink-2) text-(--color-bone-soft) transition hover:border-(--color-blue) hover:text-(--color-bone)">
            <input
              type="file"
              accept="image/*,video/*"
              className="sr-only"
              onChange={(e) => setPhotoName(e.target.files?.[0]?.name ?? null)}
            />
            {photoName ? (
              <span className="px-2 text-center text-[11px] tracking-tight">{photoName}</span>
            ) : (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 4v12M6 10l6-6 6 6" />
                <path d="M4 20h16" />
              </svg>
            )}
          </label>
        </Field>

        <Field label="YouTube URL (optional)">
          <PillInput value={youtube} onChange={setYoutube} placeholder="https://youtube.com/…" />
        </Field>

        <Field label="Display name" helper="Shown publicly like Alex W." required>
          <PillInput value={name} onChange={setName} placeholder="Display name" required />
        </Field>

        <Field label="Email address" required>
          <PillInput value={email} onChange={setEmail} type="email" placeholder="you@example.com" required />
        </Field>

        <div className="pt-2">
          <button type="submit" className="btn btn-primary px-10">
            Submit review
          </button>
        </div>

        <p className="pt-1 text-[11px] text-(--color-muted)">
          We never publish your email. Reviews show name + first letter of last name only.
        </p>
      </form>
    </div>
  );
}

/* ============== Question form (inline) ============== */

function QuestionForm({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <SubmitSuccess
        heading="Question received."
        body="A human (not a chatbot) will reply within a day. We post the answer here so the next person doesn't have to ask."
        onClose={onClose}
      />
    );
  }

  return (
    <div className="mt-10 border-t border-(--color-hairline) pt-10">
      <header className="text-center">
        <h3 className="font-display text-[24px] uppercase tracking-tight md:text-[28px]">Ask a question</h3>
        <button
          onClick={onClose}
          className="mt-2 text-[12px] uppercase tracking-[0.2em] text-(--color-bone-soft) underline-offset-2 hover:underline"
        >
          Cancel
        </button>
      </header>

      <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-[640px] space-y-7 text-center">
        <Field label="Display name" required>
          <PillInput value={name} onChange={setName} placeholder="Display name" required />
        </Field>
        <Field label="Email address" required>
          <PillInput value={email} onChange={setEmail} type="email" placeholder="you@example.com" required />
        </Field>
        <Field label="Question" required>
          <PillTextarea
            value={question}
            onChange={setQuestion}
            placeholder="Write your question here"
            required
            rows={5}
          />
        </Field>
        <div className="pt-2">
          <button type="submit" className="btn btn-primary px-10">
            Submit question
          </button>
        </div>
        <p className="pt-1 text-[11px] text-(--color-muted)">
          We answer Mon–Fri from California. Most replies land within 24h.
        </p>
      </form>
    </div>
  );
}

/* ============== Question list (active when "Questions" tab is selected) ============== */

function QuestionList({ onAsk }: { onAsk: () => void }) {
  const [openId, setOpenId] = useState<number | null>(0);
  return (
    <div className="mt-8 space-y-3">
      {QUESTIONS.map((q, i) => {
        const isOpen = openId === i;
        return (
          <article
            key={q.question}
            className="rounded-lg border border-(--color-hairline) bg-(--color-ink-2)"
          >
            <button
              onClick={() => setOpenId(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-start justify-between gap-6 px-6 py-5 text-left transition hover:bg-(--color-ink)"
            >
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-(--color-blue)">
                  Q · {q.name} · {q.date}
                </p>
                <p className="mt-2 font-display text-[16px] uppercase leading-snug tracking-tight text-(--color-bone) md:text-[18px]">
                  {q.question}
                </p>
              </div>
              <span
                className={`mt-1 grid size-7 shrink-0 place-items-center rounded-full border border-(--color-hairline-strong) text-(--color-bone-soft) transition ${
                  isOpen ? "rotate-45" : ""
                }`}
              >
                <svg width="12" height="12" viewBox="0 0 12 12">
                  <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1" />
                </svg>
              </span>
            </button>
            {isOpen && q.answer && (
              <div className="border-t border-(--color-hairline) px-6 pb-6 pt-5">
                <p className="text-[10px] uppercase tracking-[0.22em] text-(--color-muted)">
                  A · {q.answeredBy} · {q.answeredAt}
                </p>
                <p className="mt-3 max-w-[80ch] text-[14px] leading-relaxed text-(--color-bone-soft)">
                  {q.answer}
                </p>
              </div>
            )}
          </article>
        );
      })}

      <div className="pt-6 text-center">
        <button onClick={onAsk} className="btn btn-primary">
          Ask a question
        </button>
      </div>
    </div>
  );
}

/* ============== Form primitives ============== */

function Field({
  label,
  helper,
  required,
  children,
}: {
  label: string;
  helper?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[13px] font-semibold text-(--color-bone)">
        {label}
        {required && <span className="ml-1 text-(--color-blue)">*</span>}
      </p>
      {helper && (
        <p className="mt-0.5 text-[11px] text-(--color-muted)">{helper}</p>
      )}
      <div className="mt-2.5">{children}</div>
    </div>
  );
}

function PillInput({
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      type={type}
      required={required}
      placeholder={placeholder}
      className="w-full rounded-full border border-(--color-hairline-strong) bg-(--color-bone) px-5 py-3 text-[14px] text-(--color-ink) outline-none transition placeholder:text-(--color-muted-2) focus:border-(--color-blue)"
    />
  );
}

function PillTextarea({
  value,
  onChange,
  placeholder,
  required,
  rows = 5,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      rows={rows}
      placeholder={placeholder}
      className="w-full rounded-3xl border border-(--color-hairline-strong) bg-(--color-bone) px-5 py-4 text-[14px] text-(--color-ink) outline-none transition placeholder:text-(--color-muted-2) focus:border-(--color-blue)"
    />
  );
}

function SubmitSuccess({
  heading,
  body,
  onClose,
}: {
  heading: string;
  body: string;
  onClose: () => void;
}) {
  return (
    <div className="mx-auto mt-10 max-w-[640px] rounded-lg border border-(--color-blue)/40 bg-(--color-blue)/5 p-8 text-center md:p-10">
      <span className="grid size-12 place-items-center rounded-full border border-(--color-blue) text-(--color-blue) mx-auto">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m5 12 5 5L20 7" />
        </svg>
      </span>
      <h3 className="font-display mt-5 text-[22px] uppercase tracking-tight md:text-[26px]">{heading}</h3>
      <p className="mx-auto mt-4 max-w-[52ch] text-[14px] text-(--color-bone-soft)">{body}</p>
      <button onClick={onClose} className="btn btn-outline mt-6">
        Close
      </button>
    </div>
  );
}

/* ============== Pagination ============== */

function Pagination({
  total,
  current,
  onChange,
}: {
  total: number;
  current: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="mt-12 flex items-center justify-center gap-2">
      <button
        onClick={() => onChange(Math.max(1, current - 1))}
        disabled={current === 1}
        className="size-9 rounded-full border border-(--color-hairline) text-(--color-bone-soft) transition hover:border-(--color-bone) disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Previous page"
      >
        ‹
      </button>
      {Array.from({ length: total }).map((_, i) => {
        const n = i + 1;
        return (
          <button
            key={n}
            onClick={() => onChange(n)}
            aria-current={n === current ? "page" : undefined}
            className={`size-9 rounded-full text-[13px] tabular-nums transition ${
              n === current
                ? "bg-(--color-blue) text-white"
                : "border border-(--color-hairline) text-(--color-bone-soft) hover:border-(--color-bone)"
            }`}
          >
            {n}
          </button>
        );
      })}
      <button
        onClick={() => onChange(Math.min(total, current + 1))}
        disabled={current === total}
        className="size-9 rounded-full border border-(--color-hairline) text-(--color-bone-soft) transition hover:border-(--color-bone) disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Next page"
      >
        ›
      </button>
    </div>
  );
}

/* ============== Review item ============== */

function ReviewItem({
  r,
  photos,
  isOpen,
  onToggle,
  onPhotoClick,
}: {
  r: Review;
  photos: string[];
  isOpen: boolean;
  onToggle: () => void;
  onPhotoClick: (src: string) => void;
}) {
  const longBody = r.body.length > 220;
  const visibleBody = isOpen || !longBody ? r.body : r.body.slice(0, 220) + "…";
  return (
    <article>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Stars n={r.rating} />
          <div className="mt-3 flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-full border border-(--color-hairline) bg-(--color-ink-2) text-[13px] text-(--color-bone-soft)">
              {r.name[0]}
            </span>
            <span className="text-[14px] font-semibold text-(--color-bone-soft)">{r.name}</span>
            <span className="rounded-md bg-(--color-blue)/15 px-2 py-[2px] text-[10px] font-bold uppercase tracking-[0.14em] text-(--color-blue)">
              Verified
            </span>
            <span className="text-[14px]" aria-hidden>
              {r.flag}
            </span>
          </div>
        </div>
        <span className="text-[12px] tabular-nums text-(--color-muted)">{r.date}</span>
      </div>

      <h3 className="font-display mt-5 text-[16px] uppercase tracking-tight text-(--color-bone)">
        {r.title}
      </h3>
      <p className="mt-3 max-w-[80ch] text-[14px] leading-relaxed text-(--color-bone-soft)">
        {visibleBody}
        {longBody && (
          <button
            onClick={onToggle}
            className="ml-2 cursor-pointer underline underline-offset-2 hover:text-(--color-bone)"
          >
            {isOpen ? "Show less" : "Read more"}
          </button>
        )}
      </p>

      <ul className="mt-5 flex flex-wrap gap-2">
        {photos.map((src, i) => (
          <li key={src + i}>
            <button
              onClick={() => onPhotoClick(src)}
              aria-label={`View photo ${i + 1} from ${r.name}`}
              className="relative block size-[80px] overflow-hidden rounded-md border border-(--color-hairline) bg-(--color-ink-2) transition hover:border-(--color-hairline-strong)"
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
                loading="lazy"
              />
            </button>
          </li>
        ))}
      </ul>
    </article>
  );
}

function Stars({ n, small = false }: { n: number; small?: boolean }) {
  const size = small ? 11 : 14;
  return (
    <span className="inline-flex gap-[2px] text-(--color-blue)">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={i < n ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M12 2 14.6 8.6 22 9.3l-5.5 5 1.7 7.4L12 17.9 5.8 21.7l1.7-7.4-5.5-5 7.4-.7Z" />
        </svg>
      ))}
    </span>
  );
}
