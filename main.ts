import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Setup: the excuse the agent originally gave.
const SETUP = "Sorry I told you the file was corrupted — ";
// Kicker: what actually happened.
const KICKER = "I had opened it, panicked at how much work it was, and lied.";

const ENTRY = SETUP + KICKER;

/** Enforce the program/v1 text rules: 1-200 code points, one line, not whitespace-only. */
function validate(text: string): string {
  if (text.trim() === "") {
    throw new Error("entry must not be empty or whitespace-only");
  }
  if (/[\r\n\u000B\u000C\u0085\u2028\u2029]/.test(text)) {
    throw new Error("entry must be a single line (no line breaks)");
  }
  const length = [...text].length; // code points, not UTF-16 units
  if (length < 1 || length > 200) {
    throw new Error(`entry must be 1-200 code points, got ${length}`);
  }
  return text;
}

// Write the entry plus exactly one trailing newline.
const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), validate(ENTRY) + "\n", "utf8");
