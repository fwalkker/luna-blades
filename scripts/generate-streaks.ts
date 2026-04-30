import { writeFileSync } from "fs";

function rng(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const W = 1600;
const H = 1000;
const cx = W / 2;
const cy = H / 2;
const r = rng(0xBEEF);

const lines: string[] = [];
const N = 220;
for (let i = 0; i < N; i++) {
  const angle = r() * Math.PI * 2;
  const innerR = 80 + r() * 220;
  const outerR = 700 + r() * 1400;
  const x1 = cx + Math.cos(angle) * innerR;
  const y1 = cy + Math.sin(angle) * innerR;
  const x2 = cx + Math.cos(angle) * outerR;
  const y2 = cy + Math.sin(angle) * outerR;
  const sw = (0.5 + r() * 1.6).toFixed(2);
  const op = (0.35 + r() * 0.55).toFixed(2);
  const tint = r();
  const color = tint < 0.7 ? "#fff" : tint < 0.92 ? "#cfe2ff" : "#bcd0ff";
  lines.push(
    `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" opacity="${op}"/>`
  );
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">${lines.join("")}</svg>`;
writeFileSync("public/streaks.svg", svg);
console.log(`Wrote streaks.svg (${(svg.length / 1024).toFixed(1)} KB, ${N} streaks)`);
