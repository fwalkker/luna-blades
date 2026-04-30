import Image from "next/image";

type Props = {
  className?: string;
  /** Pixel height of the wordmark. Defaults to 36 (header). */
  height?: number;
};

const ASPECT = 1920 / 800; // approximate aspect of the wordmark asset

export default function Logo({ className = "", height = 36 }: Props) {
  const width = Math.round(height * ASPECT);
  return (
    <span className={`inline-block ${className}`}>
      <Image
        src="/wordmark.webp"
        alt="Luna Blades"
        width={width}
        height={height}
        priority
        sizes={`${width}px`}
        style={{ height, width: "auto" }}
      />
    </span>
  );
}
