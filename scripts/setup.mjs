#!/usr/bin/env node
// abunitador setup: detect the companion design skills, install the missing ones.
//   node scripts/setup.mjs            -> report only, print the exact commands
//   node scripts/setup.mjs --install  -> run them
// Idempotent. Safe to re-run.

import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const HOME = homedir();
const CWD = process.cwd();
const INSTALL = process.argv.includes("--install");

// Every place a skill can legitimately live, in the order Claude Code resolves them.
const SKILL_DIRS = [
  join(CWD, ".claude", "skills"),
  join(HOME, ".claude", "skills"),
  join(HOME, ".agents", "skills"),
];

const PLUGIN_DIRS = [
  join(HOME, ".claude", "plugins", "marketplaces"),
  join(HOME, ".claude", "plugins", "cache"),
];

const has = (cmd) =>
  spawnSync(process.platform === "win32" ? "where" : "which", [cmd], {
    shell: true,
    stdio: "ignore",
  }).status === 0;

const findSkill = (name) => {
  for (const dir of SKILL_DIRS) {
    if (existsSync(join(dir, name, "SKILL.md"))) return join(dir, name);
  }
  return null;
};

const findPluginSkill = (plugin, skill) => {
  for (const root of PLUGIN_DIRS) {
    if (!existsSync(root)) continue;
    // marketplaces/<mp>/plugins/<plugin>/skills/<skill>/SKILL.md
    for (const mp of ["claude-plugins-official"]) {
      const p = join(root, mp, "plugins", plugin, "skills", skill, "SKILL.md");
      if (existsSync(p)) return p;
    }
  }
  return null;
};

const TARGETS = [
  {
    id: "taste",
    label: "taste (anti-slop rules, dials, redesign protocol, 60-item pre-flight)",
    // Installs under the directory name design-taste-frontend.
    detect: () => findSkill("design-taste-frontend"),
    cmd: "npx -y skills@latest add Leonxlnx/taste-skill -g --all",
  },
  {
    id: "impeccable",
    label: "impeccable (craft, color strategy, typography ceilings, copy bans)",
    detect: () => findSkill("impeccable"),
    // Deliberately the generic build, not `npx impeccable install`: that installer
    // picks a scope on its own and writes hooks into the current project's
    // .claude/settings.local.json without asking. Run it yourself if you want the
    // per-harness build and its detector hooks.
    cmd: "npx -y skills@latest add pbakaus/impeccable -g --all",
  },
  {
    id: "frontend-design",
    label: "frontend-design (aesthetic direction, signature element, copy)",
    detect: () =>
      findSkill("frontend-design") ||
      findPluginSkill("frontend-design", "frontend-design"),
    cmd: "claude plugin install frontend-design@claude-plugins-official -y --scope user",
    needs: "claude",
  },
  {
    id: "web-design-guidelines",
    label: "web interface guidelines (a11y / UX audit pass)",
    detect: () => findSkill("web-design-guidelines"),
    cmd: "npx -y skills@latest add vercel-labs/agent-skills -g --skill web-design-guidelines -a '*' -y",
    // Not required: the skill is only a fetch wrapper, and abunitador falls back to
    // fetching the guidelines directly.
    optional: true,
  },
];

let missing = 0;
const plan = [];

console.log("abunitador companion skills\n");

for (const t of TARGETS) {
  const found = t.detect();
  if (found) {
    console.log(`  present  ${t.id}`);
    continue;
  }
  if (t.needs && !has(t.needs)) {
    console.log(`  SKIP     ${t.id} - needs \`${t.needs}\` on PATH`);
    continue;
  }
  console.log(`  MISSING  ${t.id}${t.optional ? " (optional)" : ""} - ${t.label}`);
  plan.push(t);
  if (!t.optional) missing++;
}

if (plan.length === 0) {
  console.log("\nEverything present. Nothing to do.");
  process.exit(0);
}

if (!INSTALL) {
  console.log("\nTo install, run:\n");
  for (const t of plan) console.log(`  ${t.cmd}`);
  console.log("\nor: node scripts/setup.mjs --install");
  console.log(
    "\nabunitador works standalone without any of these - its references/ carry a" +
      "\ndistillation. Installing them upgrades the fallbacks to the real thing."
  );
  process.exit(0);
}

console.log("");
let failed = 0;
for (const t of plan) {
  console.log(`> ${t.cmd}`);
  const r = spawnSync(t.cmd, { shell: true, stdio: "inherit" });
  if (r.status !== 0) {
    console.error(`  FAILED (exit ${r.status}) - ${t.id}`);
    failed++;
  }
}

console.log("\nverifying...");
for (const t of TARGETS) {
  console.log(`  ${t.detect() ? "present" : "STILL MISSING"}  ${t.id}`);
}

if (failed) {
  console.error(
    `\n${failed} install(s) failed. abunitador still runs - it falls back to references/.`
  );
  process.exit(1);
}
console.log("\nDone. Restart the session so new skills are picked up.");
