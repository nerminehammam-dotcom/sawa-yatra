import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

/**
 * Reads the palette out of styles/tokens.css and works out what it can prove
 * about how the stylesheets use it.
 *
 * The point of this file is to turn a comment into a guarantee. tokens.css has
 * carried a full WCAG pairing matrix since the start, and it records why:
 * pink-on-olive at 1.88 shipped to production once because nothing said it was
 * illegal. A comment cannot stop that happening again. A test can.
 */

export const ROOT = path.resolve(__dirname, "../..");
const TOKENS = path.join(ROOT, "styles/tokens.css");

/** The eight colours the brief actually defines. Everything else is an alias. */
export const BASE_COLOURS = [
  "paper",
  "ink",
  "signal",
  "signal-text",
  "clay",
  "sun",
  "olive",
  "pink",
] as const;

export type BaseColour = (typeof BASE_COLOURS)[number];

export const AA_NORMAL = 4.5;
export const AA_LARGE = 3;

// ---------------------------------------------------------------------------
// Colour maths. WCAG 2.1 relative luminance and contrast ratio.
// ---------------------------------------------------------------------------

function channelToLinear(channel: number): number {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

export function hexToRgb(value: string): [number, number, number] {
  const hex = value.trim().replace("#", "");
  const full = hex.length === 3 ? hex.split("").map((c) => c + c).join("") : hex;
  return [
    Number.parseInt(full.slice(0, 2), 16),
    Number.parseInt(full.slice(2, 4), 16),
    Number.parseInt(full.slice(4, 6), 16),
  ];
}

export function relativeLuminance(hex: string): number {
  const [red, green, blue] = hexToRgb(hex);
  return (
    0.2126 * channelToLinear(red) +
    0.7152 * channelToLinear(green) +
    0.0722 * channelToLinear(blue)
  );
}

export function contrast(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** Two decimal places, the same precision the documented table uses. */
export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

// ---------------------------------------------------------------------------
// Reading tokens.css
// ---------------------------------------------------------------------------

export function readTokensSource(): string {
  return readFileSync(TOKENS, "utf8");
}

/**
 * Every custom property declared in tokens.css, with var() chains followed to
 * ground. A property that does not end in a hex value is simply absent, which
 * is correct: spacing and font tokens are not colours.
 */
export function resolvedTokens(): Map<string, string> {
  const source = readTokensSource();
  const raw = new Map<string, string>();

  for (const match of source.matchAll(/^\s*(--[\w-]+)\s*:\s*([^;]+);/gm)) {
    const [, name, value] = match;
    if (name && value) raw.set(name, value.trim());
  }

  const resolved = new Map<string, string>();
  for (const [name, declared] of raw) {
    let value: string | undefined = declared;
    // Ten hops is far more than the deepest alias chain in the file and stops
    // a circular definition hanging the test run.
    for (let hop = 0; hop < 10 && value !== undefined; hop += 1) {
      const alias = /^var\((--[\w-]+)\)$/.exec(value);
      if (!alias?.[1]) break;
      value = raw.get(alias[1]);
    }
    if (value !== undefined && /^#[0-9a-f]{3,8}$/i.test(value)) {
      resolved.set(name, value.slice(0, 7));
    }
  }
  return resolved;
}

/** Alias name (without --) -> base colour name, e.g. terracotta -> clay. */
export function paletteByHex(): Map<string, BaseColour> {
  const tokens = resolvedTokens();
  const byHex = new Map<string, BaseColour>();
  for (const name of BASE_COLOURS) {
    const hex = tokens.get(`--${name}`);
    if (hex) byHex.set(hex.toLowerCase(), name);
  }
  return byHex;
}

/** Resolve any token name to the base colour it ultimately is, or undefined. */
export function baseColourOf(token: string): BaseColour | undefined {
  const hex = resolvedTokens().get(token);
  if (!hex) return undefined;
  return paletteByHex().get(hex.toLowerCase());
}

// ---------------------------------------------------------------------------
// The documented matrix, parsed back out of its own comment
// ---------------------------------------------------------------------------

export interface DocumentedCell {
  row: BaseColour;
  column: BaseColour;
  ratio: number;
  mark: "" | "L" | "x";
}

const HEADER_TO_COLOUR: Record<string, BaseColour> = {
  paper: "paper",
  ink: "ink",
  signal: "signal",
  "sig-txt": "signal-text",
  clay: "clay",
  sun: "sun",
  olive: "olive",
  pink: "pink",
};

/**
 * Reads the table in the tokens.css comment. If the table is reformatted this
 * throws rather than silently passing — a matrix nobody can parse is a matrix
 * nobody is checking.
 */
export function documentedMatrix(): DocumentedCell[] {
  const source = readTokensSource();
  const lines = source.split("\n");

  const headerIndex = lines.findIndex((line) => /paper\s+ink\s+signal\s+sig-txt/.test(line));
  const header = lines[headerIndex];
  if (headerIndex === -1 || header === undefined) {
    throw new Error("Could not find the contrast table header in styles/tokens.css");
  }

  const columns = (header.match(/paper|ink|signal|sig-txt|clay|sun|olive|pink/g) ?? []).map(
    (name) => HEADER_TO_COLOUR[name],
  );

  const cells: DocumentedCell[] = [];
  for (let i = headerIndex + 1; i < lines.length; i += 1) {
    const line = lines[i];
    const rowMatch = line
      ? /^\s*\*\s+(paper|ink|signal|sig-txt|clay|sun|olive|pink)\s+(.*)$/.exec(line)
      : null;
    if (!rowMatch?.[1] || rowMatch[2] === undefined) {
      if (cells.length > 0) break;
      continue;
    }
    const row = HEADER_TO_COLOUR[rowMatch[1]];
    if (!row) continue;
    const tokens = rowMatch[2].trim().split(/\s+/);
    tokens.forEach((token, index) => {
      const column = columns[index];
      if (!column || token === "--") return;
      const value = /^([\d.]+)([Lx]?)$/.exec(token);
      if (!value?.[1]) return;
      cells.push({
        row,
        column,
        ratio: Number.parseFloat(value[1]),
        mark: (value[2] as "" | "L" | "x" | undefined) ?? "",
      });
    });
  }
  return cells;
}

export function markFor(ratio: number): "" | "L" | "x" {
  if (ratio >= AA_NORMAL) return "";
  if (ratio >= AA_LARGE) return "L";
  return "x";
}

// ---------------------------------------------------------------------------
// What the stylesheets actually do
// ---------------------------------------------------------------------------

export interface UsedPair {
  file: string;
  selector: string;
  colourToken: string;
  backgroundToken: string;
  foreground: BaseColour;
  background: BaseColour;
  ratio: number;
}

const STYLE_DIRECTORIES = ["app", "components", "styles"];

function cssFiles(): string[] {
  const files: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      const full = path.join(dir, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (entry.endsWith(".css")) files.push(full);
    }
  };
  for (const directory of STYLE_DIRECTORIES) {
    const full = path.join(ROOT, directory);
    try {
      walk(full);
    } catch {
      // Directory absent in a partial checkout; nothing to scan.
    }
  }
  return files;
}

function tokenIn(declaration: string): string | undefined {
  const match = declaration.match(/var\((--[\w-]+)/);
  return match?.[1];
}

/**
 * Colour pairs that a single rule sets on itself.
 *
 * The deliberate limit, stated rather than hidden: this only sees a pair when
 * one rule sets BOTH a palette colour and a palette background. Text that
 * inherits its colour from an ancestor and sits on a background set elsewhere
 * is invisible here, because resolving that needs the cascade, which needs a
 * browser. What it does catch is exactly the shape of the bug that shipped —
 * a rule that paints itself an illegal pair.
 */
export function usedPairs(): UsedPair[] {
  const tokens = resolvedTokens();
  const byHex = paletteByHex();
  const pairs: UsedPair[] = [];

  const toBase = (token: string | undefined): BaseColour | undefined => {
    if (!token) return undefined;
    const hex = tokens.get(token);
    return hex ? byHex.get(hex.toLowerCase()) : undefined;
  };

  for (const file of cssFiles()) {
    const source = readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    for (const block of source.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const [, rawSelector, body] = block;
      if (rawSelector === undefined || body === undefined) continue;

      const selector = rawSelector.trim().replace(/\s+/g, " ");
      if (selector.startsWith("@") || selector.includes(":root")) continue;

      const colourDeclaration = /(?:^|;)\s*color\s*:\s*([^;]+)/.exec(body);
      const backgroundDeclaration = /(?:^|;)\s*background(?:-color)?\s*:\s*([^;]+)/.exec(body);
      if (!colourDeclaration?.[1] || !backgroundDeclaration?.[1]) continue;

      const colourToken = tokenIn(colourDeclaration[1]);
      const backgroundToken = tokenIn(backgroundDeclaration[1]);
      if (!colourToken || !backgroundToken) continue;

      const foreground = toBase(colourToken);
      const background = toBase(backgroundToken);
      const colourHex = tokens.get(colourToken);
      const backgroundHex = tokens.get(backgroundToken);
      if (!foreground || !background || !colourHex || !backgroundHex) continue;
      if (foreground === background) continue;

      pairs.push({
        file: path.relative(ROOT, file),
        selector,
        colourToken,
        backgroundToken,
        foreground,
        background,
        ratio: round2(contrast(colourHex, backgroundHex)),
      });
    }
  }
  return pairs;
}
