"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { BIG_FEATURE_MEDIA } from "@/lib/placeholder-media";

type Row = {
  titlePre: string;
  titleAccent: string;
  body: string;
  highlight: string;
  badge: string;
  poster: string;
  video?: string;
  videoLabel: string;
  duration: string;
};

const ROWS: Row[] = [
  {
    badge: "01 · Combat",
    titlePre: "Built for real combat — ",
    titleAccent: "tested to the limit",
    body: "Every Luna hilt is engineered for full-contact dueling, not display. We stress-test each model under live strikes, drop loads, and even car tires before it ships.",
    highlight: "Real durability is earned, not claimed.",
    poster: BIG_FEATURE_MEDIA[0],
    video: "/videos/feature-1.mp4",
    videoLabel: "Stress test",
    duration: "0:14",
  },
  {
    badge: "02 · Control",
    titlePre: "Designed for ",
    titleAccent: "true control",
    body: "Our hilts fit naturally in the hand — balanced weight, recessed switch geometry, brass choke point. The grip stays steady through spins, flips, and dual-blade choreography.",
    highlight: "It feels like a tool, not a prop.",
    poster: BIG_FEATURE_MEDIA[1],
    video: "/videos/feature-2.mp4",
    videoLabel: "Form work",
    duration: "0:22",
  },
  {
    badge: "03 · Joy",
    titlePre: "A moment shared by ",
    titleAccent: "millions",
    body: "More than a saber — it's a shared experience across the galaxy. Owners light them up at meetups, conventions, weddings, garage duels, and quiet nights at home.",
    highlight: "It's the toy you keep forever.",
    poster: BIG_FEATURE_MEDIA[2],
    video: "/videos/feature-3.mp4",
    videoLabel: "Crowd light-up",
    duration: "0:31",
  },
];

export default function BigFeatureBlocks() {
  return (
    <section className="border-t border-(--color-hairline) px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-[1230px] space-y-20 md:space-y-28">
        {ROWS.map((r, i) => (
          <FeatureRow key={r.badge} row={r} reversed={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}

function FeatureRow({ row, reversed }: { row: Row; reversed: boolean }) {
  return (
    <article
      className={`grid items-center gap-10 md:gap-16 ${
        reversed ? "md:grid-cols-[1.05fr_1fr]" : "md:grid-cols-[1fr_1.05fr]"
      }`}
    >
      <div className={reversed ? "md:order-2" : "md:order-1"}>
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-(--color-blue)">
          {row.badge}
        </p>
        <h2 className="font-display mt-5 text-[40px] uppercase leading-[0.95] tracking-tight text-(--color-blue) md:text-[56px]">
          {row.titlePre}
          <span className="text-(--color-bone)">{row.titleAccent}</span>
        </h2>
        <span className="mt-5 block h-px w-[80%] max-w-[420px] bg-(--color-blue)/60" />
        <p className="mt-6 max-w-[44ch] text-[15px] leading-relaxed text-(--color-bone) md:text-[16px]">
          {row.body}
        </p>
        <p className="mt-3 max-w-[44ch] text-[15px] font-semibold leading-relaxed text-(--color-blue) md:text-[16px]">
          {row.highlight}
        </p>
      </div>
      <div className={reversed ? "md:order-1" : "md:order-2"}>
        <VideoTile row={row} />
      </div>
    </article>
  );
}

function VideoTile({ row }: { row: Row }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);

  // Reflect React state onto the video element
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = muted;
    if (playing) v.play().catch(() => {});
    else v.pause();
  }, [playing, muted]);

  function togglePlay() {
    setPlaying((p) => !p);
  }

  function toggleMute(e: React.MouseEvent) {
    e.stopPropagation();
    setMuted((m) => !m);
  }

  return (
    <div
      onClick={togglePlay}
      className="group relative block aspect-[16/10] w-full cursor-pointer overflow-hidden rounded-lg border border-(--color-hairline) bg-(--color-ink-2)"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          togglePlay();
        }
      }}
      aria-label={`${playing ? "Pause" : "Play"} ${row.videoLabel}`}
    >
      {row.video ? (
        <video
          ref={videoRef}
          src={row.video}
          poster={row.poster}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <Image
          src={row.poster}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain p-8"
          loading="lazy"
        />
      )}

      <span
        className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent transition-opacity ${
          playing ? "opacity-50 group-hover:opacity-100" : "opacity-100"
        }`}
      />

      {/* Center play/pause */}
      <span
        className={`pointer-events-none absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-(--color-blue) text-white shadow-[0_8px_24px_rgba(0,0,0,0.6)] transition ${
          playing ? "opacity-0 group-hover:opacity-100" : "opacity-100"
        }`}
      >
        {playing ? (
          <svg width="22" height="22" viewBox="0 0 16 16" fill="currentColor">
            <rect x="4" y="3" width="3" height="10" />
            <rect x="9" y="3" width="3" height="10" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 16 16" fill="currentColor">
            <path d="M5 3v10l9-5L5 3Z" />
          </svg>
        )}
      </span>

      {/* Top-left label */}
      <span className="pointer-events-none absolute left-4 top-4 rounded-full border border-white/20 bg-black/60 px-3 py-[3px] text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
        {row.videoLabel}
      </span>

      {/* Top-right duration */}
      <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-black/70 px-2 py-[2px] text-[10px] tabular-nums text-white">
        {row.duration}
      </span>

      {/* Bottom-right sound toggle */}
      {row.video && (
        <button
          onClick={toggleMute}
          aria-label={muted ? "Unmute" : "Mute"}
          className="absolute bottom-4 right-4 grid size-9 place-items-center rounded-full border border-white/20 bg-black/60 text-white transition hover:bg-black/80"
        >
          {muted ? <SoundOff /> : <SoundOn />}
        </button>
      )}
    </div>
  );
}

function SoundOff() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M11 5 6 9H3v6h3l5 4V5Z" />
      <path d="m16 9 5 6M21 9l-5 6" />
    </svg>
  );
}
function SoundOn() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M11 5 6 9H3v6h3l5 4V5Z" />
      <path d="M16 8a5 5 0 0 1 0 8M19 5a9 9 0 0 1 0 14" />
    </svg>
  );
}
