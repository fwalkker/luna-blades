import { writeFileSync, mkdirSync } from "fs";
import { dirname } from "path";

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildStarfield(seed: number, w: number, h: number, count: number, flares: number) {
  const r = mulberry32(seed);
  const pieces: string[] = [];

  // Soft nebula clouds — three big radial blobs at low opacity
  const nebulaPalette = ["#3a4d8a", "#7a4a9c", "#2a6a90", "#a0586c"];
  for (let i = 0; i < 4; i++) {
    const cx = (r() * w).toFixed(0);
    const cy = (r() * h).toFixed(0);
    const rad = (220 + r() * 280).toFixed(0);
    const c = nebulaPalette[i % nebulaPalette.length];
    pieces.push(
      `<radialGradient id="n${i}" cx="${cx}" cy="${cy}" r="${rad}" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="${c}" stop-opacity="0.10"/><stop offset="60%" stop-color="${c}" stop-opacity="0.04"/><stop offset="100%" stop-color="${c}" stop-opacity="0"/></radialGradient>`
    );
  }
  const defs = `<defs>${pieces.join("")}</defs>`;
  pieces.length = 0;
  for (let i = 0; i < 4; i++) pieces.push(`<rect width="${w}" height="${h}" fill="url(#n${i})"/>`);

  // Stars — three size buckets
  for (let i = 0; i < count; i++) {
    const x = (r() * w).toFixed(1);
    const y = (r() * h).toFixed(1);
    const size = r();
    const radius = size < 0.6 ? 0.35 : size < 0.9 ? 0.7 : size < 0.97 ? 1.1 : 1.6;
    const opacity = (0.18 + r() * 0.7).toFixed(2);
    const tint = r();
    const fill = tint < 0.55 ? "#fff" : tint < 0.78 ? "#cfd8e8" : tint < 0.90 ? "#a9b3c7" : tint < 0.97 ? "#f5e4c2" : "#bcd6ff";
    pieces.push(`<circle cx="${x}" cy="${y}" r="${radius}" fill="${fill}" opacity="${opacity}"/>`);
  }

  // Cross-flared near stars
  for (let i = 0; i < flares; i++) {
    const x = (r() * w).toFixed(1);
    const y = (r() * h).toFixed(1);
    const fx = parseFloat(x);
    const fy = parseFloat(y);
    pieces.push(`<g opacity="0.55"><circle cx="${x}" cy="${y}" r="1.5" fill="#fff"/><line x1="${fx-4}" y1="${y}" x2="${fx+4}" y2="${y}" stroke="#fff" stroke-width="0.4" opacity="0.6"/><line x1="${x}" y1="${fy-4}" x2="${x}" y2="${fy+4}" stroke="#fff" stroke-width="0.4" opacity="0.6"/></g>`);
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${defs}<rect width="${w}" height="${h}" fill="#0A0E14"/>${pieces.join("")}</svg>`;
}

mkdirSync("public", { recursive: true });

// Two layers — primary deep field with nebula, secondary fine star dust
const deep = buildStarfield(0xC0FFEE, 1800, 1100, 480, 7);
const dust = buildStarfield(0xBADF00D, 900, 600, 220, 0);

writeFileSync("public/stars.svg", deep);
writeFileSync("public/star-dust.svg", dust);

console.log(`Wrote stars.svg (${(deep.length / 1024).toFixed(1)} KB) + star-dust.svg (${(dust.length / 1024).toFixed(1)} KB)`);
