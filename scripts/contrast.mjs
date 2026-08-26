#!/usr/bin/env node
// WCAG 2.2 contrast checker. Turns the most-failed gate item into a number.
//
//   node scripts/contrast.mjs "#6b7280" "#f9fafb"
//   node scripts/contrast.mjs "rgb(107 114 128)" "#fff" --large
//   node scripts/contrast.mjs --pairs pairs.txt      # one "fg bg [label]" per line
//
// Formulas per W3C WCAG 2.2 Technique G18:
//   linearize: c <= 0.04045 ? c/12.92 : ((c+0.055)/1.055)^2.4
//   L = 0.2126R + 0.7152G + 0.0722B
//   ratio = (Llight + 0.05) / (Ldark + 0.05)
//
// Takes hex and rgb() only. OKLCH tokens must be resolved to hex first - browser
// devtools will show you the computed value. Do not eyeball the conversion.

import { readFileSync } from "node:fs";

const parse = (input) => {
  const s = String(input).trim().toLowerCase();

  let m = s.match(/^#?([0-9a-f]{3})$/);
  if (m) return [...m[1]].map((c) => parseInt(c + c, 16));

  m = s.match(/^#?([0-9a-f]{6})$/);
  if (m) return [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16));

  m = s.match(/^rgba?\(([^)]+)\)$/);
  if (m) {
    const parts = m[1].split(/[\s,/]+/).filter(Boolean).slice(0, 3);
    if (parts.length === 3) {
      return parts.map((p) =>
        p.endsWith("%")
          ? Math.round((parseFloat(p) / 100) * 255)
          : parseInt(p, 10)
      );
    }
  }

  if (s.startsWith("oklch") || s.startsWith("lch") || s.startsWith("lab")) {
    throw new Error(
      `${input}: resolve to hex first. This tool does not convert ${s.slice(0, 5)}.`
    );
  }
  throw new Error(`${input}: unrecognised color. Use #rgb, #rrggbb, or rgb(...).`);
};

const luminance = (rgb) => {
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const ratio = (fg, bg) => {
  const a = luminance(parse(fg));
  const b = luminance(parse(bg));
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
};

// large = >=18pt/24px, or bold >=14pt/18.66px
const check = (fg, bg, { large = false, label = "" } = {}) => {
  const r = ratio(fg, bg);
  const aa = large ? 3 : 4.5;
  const aaa = large ? 4.5 : 7;
  const pass = r >= aa;
  return {
    line:
      `${pass ? "PASS" : "FAIL"}  ${r.toFixed(2)}:1  ` +
      `${fg} on ${bg}  ` +
      `[AA ${large ? "large" : "body"} needs ${aa}${r >= aaa ? ", AAA too" : ""}]` +
      (label ? `  ${label}` : ""),
    pass,
  };
};

const args = process.argv.slice(2);
const large = args.includes("--large");
const pairsIdx = args.indexOf("--pairs");

let rows = [];
if (pairsIdx !== -1) {
  const file = args[pairsIdx + 1];
  if (!file) {
    console.error("--pairs needs a file path");
    process.exit(2);
  }
  rows = readFileSync(file, "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => {
      const [fg, bg, ...rest] = l.split(/\s+/);
      return { fg, bg, label: rest.join(" ") };
    });
} else {
  const [fg, bg] = args.filter((a) => !a.startsWith("--"));
  if (!fg || !bg) {
    console.error(
      'usage: node scripts/contrast.mjs "#fg" "#bg" [--large]\n' +
        "       node scripts/contrast.mjs --pairs pairs.txt"
    );
    process.exit(2);
  }
  rows = [{ fg, bg, label: "" }];
}

let failures = 0;
for (const row of rows) {
  try {
    const { line, pass } = check(row.fg, row.bg, { large, label: row.label });
    console.log(line);
    if (!pass) failures++;
  } catch (e) {
    console.error(`ERROR ${e.message}`);
    failures++;
  }
}

if (failures) {
  console.error(`\n${failures} of ${rows.length} failed.`);
  process.exit(1);
}
console.log(`\nAll ${rows.length} pass.`);
