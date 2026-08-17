#!/usr/bin/env node
/**
 * Rule-based replacement for the old prompt-based subagentStop hook.
 * Avoids an extra LLM call after every subagent run — matches known
 * agent names/descriptions with plain regexes instead.
 */

const FEATURE_AGENTS = /\b(feature-builder|table-builder|feature-flow)\b/i;
const REVIEW_AGENTS = /\b(code-review|code-reviewer|bugbot|security-review)\b/i;

function readStdin() {
  return new Promise((resolve) => {
    let raw = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => (raw += chunk));
    process.stdin.on("end", () => resolve(raw));
    process.stdin.on("error", () => resolve(raw));
  });
}

async function main() {
  const raw = await readStdin();
  let data = {};
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    data = {};
  }

  const haystack = JSON.stringify(data).toLowerCase();
  let followup_message = "";

  if (FEATURE_AGENTS.test(haystack)) {
    followup_message = "فیچر ساخته شد. میخوای code-review بزنم؟ (پیشنهاد: بله)";
  } else if (REVIEW_AGENTS.test(haystack)) {
    followup_message = "Review تمام شد. میخوای commit message بسازم؟ (پیشنهاد: بله)";
  }

  const output = followup_message ? { followup_message } : {};
  process.stdout.write(JSON.stringify(output));
}

main();
