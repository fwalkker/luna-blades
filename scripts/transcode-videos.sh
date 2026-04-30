#!/usr/bin/env bash
# Batch-transcode any video in public/videos/ to web-optimized MP4.
# - H.264 + AAC, yuv420p for universal browser support
# - Max height 720, CRF 23 for good size/quality balance
# - +faststart so the moov atom is at the front (streams instantly)
# - Generates a matching .jpg poster at the 1-second mark
# - Originals are moved to public/videos/_originals/ as backup (never deleted)
# - Idempotent: skips files that already have a backup in _originals/
#
# Usage:
#   bun run videos:transcode
#   bash scripts/transcode-videos.sh
#   bash scripts/transcode-videos.sh --force        # re-transcode everything
#   bash scripts/transcode-videos.sh path/to/file   # transcode just one file

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
VIDEOS_DIR="$ROOT/public/videos"
BACKUP_DIR="$VIDEOS_DIR/_originals"

FORCE=0
TARGETS=()
for arg in "$@"; do
  case "$arg" in
    --force|-f) FORCE=1 ;;
    *) TARGETS+=("$arg") ;;
  esac
done

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "✖ ffmpeg not found on PATH."
  echo "  Install: scoop install ffmpeg     (Windows)"
  echo "          brew install ffmpeg       (macOS)"
  echo "          apt install ffmpeg        (Linux)"
  exit 1
fi

mkdir -p "$BACKUP_DIR"

if [ "${#TARGETS[@]}" -eq 0 ]; then
  # Default: every video in public/videos/ that isn't inside _originals/
  shopt -s nullglob
  TARGETS=()
  for f in "$VIDEOS_DIR"/*.{mp4,mov,m4v,mkv,avi,webm,MP4,MOV,M4V,MKV,AVI,WEBM}; do
    [ -f "$f" ] || continue
    TARGETS+=("$f")
  done
  shopt -u nullglob
fi

if [ "${#TARGETS[@]}" -eq 0 ]; then
  echo "No videos found in $VIDEOS_DIR"
  exit 0
fi

transcode_one() {
  local src="$1"
  local base name backup_path out_path poster_path size_before size_after

  if [ ! -f "$src" ]; then
    echo "✖ skipping: not a file: $src"
    return
  fi

  name="$(basename "$src")"
  base="${name%.*}"
  backup_path="$BACKUP_DIR/$name"
  out_path="$VIDEOS_DIR/$base.mp4"
  poster_path="$VIDEOS_DIR/$base.jpg"

  if [ "$FORCE" -ne 1 ] && [ -f "$backup_path" ] && [ -f "$out_path" ]; then
    echo "✓ already processed: $name (use --force to redo)"
    return
  fi

  size_before=$(stat -c%s "$src" 2>/dev/null || stat -f%z "$src" 2>/dev/null || echo 0)
  echo "→ $name  ($(printf "%'d" "$size_before") bytes)"

  # Move original to backup (or copy if it's already a .mp4 we'd be overwriting in place)
  if [ ! -f "$backup_path" ]; then
    cp "$src" "$backup_path"
  fi

  # Transcode to a temp path, then atomically swap to final location.
  local tmp="$out_path.tmp.mp4"

  ffmpeg -y -hide_banner -loglevel error -stats \
    -i "$src" \
    -map 0:v:0 -map 0:a:0? \
    -vf "scale='min(1280,iw)':-2,format=yuv420p" \
    -c:v libx264 -preset slow -crf 23 \
    -profile:v high -level 4.1 \
    -movflags +faststart \
    -c:a aac -b:a 128k -ac 2 \
    "$tmp"

  # If source was .mp4 and out_path is the same, remove old before move
  if [ "$src" = "$out_path" ]; then
    rm -f "$src"
  fi

  mv "$tmp" "$out_path"

  # If the source had a different extension, remove the original from VIDEOS_DIR
  # (it's already backed up in _originals/)
  if [ -f "$src" ] && [ "$src" != "$out_path" ]; then
    rm -f "$src"
  fi

  # Generate a poster frame at 1s
  ffmpeg -y -hide_banner -loglevel error \
    -ss 1 -i "$out_path" \
    -frames:v 1 -q:v 4 \
    "$poster_path" || true

  size_after=$(stat -c%s "$out_path" 2>/dev/null || stat -f%z "$out_path" 2>/dev/null || echo 0)
  echo "  → $base.mp4  ($(printf "%'d" "$size_after") bytes)  poster: $base.jpg"
}

for t in "${TARGETS[@]}"; do
  transcode_one "$t"
done

echo "Done. Originals are in $BACKUP_DIR (move to trash/ if you no longer need them)."
