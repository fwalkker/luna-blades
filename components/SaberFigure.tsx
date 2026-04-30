"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { bladeGlow, type BladeColor } from "@/lib/products";

type Props = {
  src: string;
  alt: string;
  blade: BladeColor;
  priority?: boolean;
  className?: string;
  ignite?: boolean;
};

export default function SaberFigure({ src, alt, blade, priority, className = "", ignite }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.setProperty("--blade-glow", bladeGlow(blade));
  }, [blade]);

  return (
    <div ref={ref} className={`saber-stage relative ${className}`}>
      <div className={ignite ? "ignite relative" : "relative"}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-contain"
        />
      </div>
    </div>
  );
}
