"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { VIDEO_REVIEW_COVERS } from "@/lib/placeholder-media";

type Review = {
  cover: string;
  name: string;
  handle: string;
  duration: string;
  /** Optional: when present the tile renders a real <video> instead of a poster */
  video?: string;
};

const REVIEWS: Review[] = [
  { cover: VIDEO_REVIEW_COVERS[0], name: "Marcus", handle: "@marcusduels",     duration: "3:42", video: "/videos/review-1.mp4" },
  { cover: VIDEO_REVIEW_COVERS[1], name: "Devin",  handle: "@devin.ks",        duration: "2:18", video: "/videos/review-2.mp4" },
  { cover: VIDEO_REVIEW_COVERS[2], name: "Sarah",  handle: "@gift.shop.sarah", duration: "1:56" },
  { cover: VIDEO_REVIEW_COVERS[3], name: "Tariq",  handle: "@tariq.builds",    duration: "4:21" },
  { cover: VIDEO_REVIEW_COVERS[4], name: "Olivia", handle: "@livfromohio",     duration: "2:44" },
];

export default function VideoReviews() {
  return (
    <section className="border-y border-(--color-hairline) bg-(--color-ink-2) px-5 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-[1230px]">
        <header className="mb-8 grid items-end gap-4 md:grid-cols-[1fr_auto]">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-(--color-blue)">As seen on</p>
            <h2 className="font-display mt-3 text-[28px] uppercase tracking-tight md:text-[36px]">
              Video reviews from real owners
            </h2>
          </div>
          <p className="max-w-[34ch] text-[13px] text-(--color-muted) md:text-right">
            Tap any tile to watch the unedited review. We don't pay for these.
          </p>
        </header>

        <div className="-mx-5 overflow-x-auto px-5 md:mx-0 md:px-0">
          <ul className="flex gap-3 md:gap-4">
            {REVIEWS.map((r) => (
              <li key={r.handle} className="shrink-0">
                <ReviewTile review={r} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function ReviewTile({ review }: { review: Review }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = muted;
    if (playing) v.play().catch(() => {});
    else v.pause();
  }, [playing, muted]);

  function togglePlay() {
    if (review.video) setPlaying((p) => !p);
  }
  function toggleMute(e: React.MouseEvent) {
    e.stopPropagation();
    setMuted((m) => !m);
  }

  return (
    <div
      onClick={togglePlay}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          togglePlay();
        }
      }}
      aria-label={`${playing ? "Pause" : "Play"} review by ${review.name}`}
      className="group relative block aspect-[9/16] w-[200px] cursor-pointer overflow-hidden rounded-lg border border-(--color-hairline) bg-(--color-ink) md:w-[220px]"
    >
      {review.video ? (
        <video
          ref={videoRef}
          src={review.video}
          poster={review.cover}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <Image
          src={review.cover}
          alt=""
          fill
          sizes="220px"
          className="object-cover opacity-80 transition group-hover:opacity-100"
        />
      )}

      <span
        className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent transition-opacity ${
          review.video && playing ? "opacity-50 group-hover:opacity-100" : "opacity-100"
        }`}
      />

      {/* Center play/pause */}
      <span
        className={`pointer-events-none absolute left-1/2 top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-(--color-blue) text-white shadow-lg transition group-hover:scale-105 ${
          review.video && playing ? "opacity-0 group-hover:opacity-100" : "opacity-100"
        }`}
      >
        {review.video && playing ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <rect x="4" y="3" width="3" height="10" />
            <rect x="9" y="3" width="3" height="10" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M5 3v10l9-5L5 3Z" />
          </svg>
        )}
      </span>

      {/* Bottom-left attribution */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 text-left">
        <p className="font-display text-[14px] uppercase tracking-tight">{review.name}</p>
        <p className="mt-0.5 text-[11px] text-(--color-bone-soft)">{review.handle}</p>
      </div>

      {/* Top-right duration */}
      <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/70 px-2 py-[2px] text-[10px] tabular-nums text-white">
        {review.duration}
      </span>

      {/* Bottom-right sound toggle (only for video tiles) */}
      {review.video && (
        <button
          onClick={toggleMute}
          aria-label={muted ? "Unmute" : "Mute"}
          className="absolute bottom-3 right-3 grid size-8 place-items-center rounded-full border border-white/20 bg-black/60 text-white transition hover:bg-black/80"
        >
          {muted ? <SoundOff /> : <SoundOn />}
        </button>
      )}
    </div>
  );
}

function SoundOff() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M11 5 6 9H3v6h3l5 4V5Z" />
      <path d="m16 9 5 6M21 9l-5 6" />
    </svg>
  );
}
function SoundOn() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M11 5 6 9H3v6h3l5 4V5Z" />
      <path d="M16 8a5 5 0 0 1 0 8M19 5a9 9 0 0 1 0 14" />
    </svg>
  );
}
