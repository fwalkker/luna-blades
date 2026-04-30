"use client";

import Image from "next/image";
import { useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  /** Single image (lightbox) */
  image?: string;
  /** Video URL — renders an in-modal player with controls and audio */
  videoSrc?: string;
  /** Caption shown below the video / on the placeholder card */
  videoLabel?: string;
  /** Arbitrary content (used by review/question forms) */
  children?: React.ReactNode;
};

/**
 * Lightweight overlay used for photo lightbox, video player, and inline forms.
 * Closes on Escape / backdrop click.
 */
export default function MediaModal({
  open,
  onClose,
  image,
  videoSrc,
  videoLabel,
  children,
}: Props) {
  useEffect(() => {
    if (!open) return;
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] grid place-items-center bg-black/90 p-4"
      role="dialog"
      aria-modal="true"
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute right-5 top-5 z-10 grid size-10 place-items-center rounded-full border border-white/20 bg-black/60 text-white transition hover:bg-black/80"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M6 6 18 18M18 6 6 18" />
        </svg>
      </button>

      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-[960px]">
        {image && !videoSrc && (
          <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-white/10 bg-(--color-ink-2)">
            <Image src={image} alt="" fill sizes="960px" className="object-contain p-6" />
          </div>
        )}

        {videoSrc && (
          <div className="overflow-hidden rounded-lg border border-white/10 bg-black">
            <video
              src={videoSrc}
              controls
              autoPlay
              playsInline
              className="aspect-video w-full bg-black"
            />
            {videoLabel && (
              <p className="border-t border-white/10 px-5 py-3 text-center font-display text-[14px] uppercase tracking-tight text-(--color-bone)">
                {videoLabel}
              </p>
            )}
          </div>
        )}

        {!image && !videoSrc && videoLabel && (
          <div className="flex aspect-video w-full flex-col items-center justify-center rounded-lg border border-white/10 bg-(--color-ink-2) p-10 text-center">
            <span className="grid size-16 place-items-center rounded-full bg-(--color-blue) text-white">
              <svg width="22" height="22" viewBox="0 0 16 16" fill="currentColor">
                <path d="M5 3v10l9-5L5 3Z" />
              </svg>
            </span>
            <p className="mt-6 font-display text-[18px] uppercase tracking-tight text-(--color-bone)">
              {videoLabel}
            </p>
            <p className="mt-3 max-w-[40ch] text-[13px] text-(--color-bone-soft)">
              Real footage drops once we finish shooting in the workshop. Press Esc to close.
            </p>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
