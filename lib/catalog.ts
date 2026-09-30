import testsData from "@/data/tests.json";
import packagesData from "@/data/packages.json";
import type { TestItem, PackageItem } from "./types";
import { aliasMatchSlugs } from "./aliases";
import { CC_SPRF_TEST_SLUGS } from "./cc-sprf-tests";

// Strikethrough reference price for individual tests: +20%, rounded up to
// the next multiple of 50, minus 1 (e.g. 100 -> 120 -> 150 -> 149). The
// actual charged price is untouched - this only sets the crossed-out MRP.
function computeStrikethroughMrp(price: number): number {
  const inflated = price * 1.2;
  const roundedUp = Math.ceil(inflated / 50) * 50;
  return roundedUp - 1;
}

export const allTests = (testsData as TestItem[]).map((t) => ({
  ...t,
  mrp: t.mrp ?? computeStrikethroughMrp(t.price),
}));
export const allPackages = packagesData as PackageItem[];

// Categories a business wants surfaced first (e.g. a current marketing push),
// in priority order; everything else follows alphabetically.
const PRIORITY_CATEGORIES = ["Full Body Checkups", "Women's Health"];
function sortWithPriority(categories: string[]): string[] {
  const priority = PRIORITY_CATEGORIES.filter((c) => categories.includes(c));
  const rest = categories.filter((c) => !PRIORITY_CATEGORIES.includes(c)).sort();
  return [...priority, ...rest];
}

export function getTestBySlug(slug: string): TestItem | undefined {
  return allTests.find((t) => t.slug === slug);
}

// The tests doctors prescribe most often (Agilus' "CC SPRF" list), ranked by
// prescribing frequency - used as the search modal's default Tests listing
// and to lead the "All Tests" page, in place of a plain popularity flag.
const testBySlug = new Map(allTests.map((t) => [t.slug, t]));
export function getFrequentlyPrescribedTests() {
  return CC_SPRF_TEST_SLUGS.map((slug) => testBySlug.get(slug)).filter((t) => t !== undefined);
}

// Full catalog, frequently-prescribed tests first (in rank order), then
// everything else in its existing catalog order.
export function getTestsOrderedByPrescribingFrequency() {
  const ranked = getFrequentlyPrescribedTests();
  const rankedSlugs = new Set(ranked.map((t) => t.slug));
  return [...ranked, ...allTests.filter((t) => !rankedSlugs.has(t.slug))];
}

export function getPackageBySlug(slug: string): PackageItem | undefined {
  return allPackages.find((p) => p.slug === slug);
}

export function getTestCategories(): string[] {
  return Array.from(new Set(allTests.map((t) => t.category))).sort();
}

export function getPackageCategories(): string[] {
  return sortWithPriority(Array.from(new Set(allPackages.map((p) => p.category))));
}

export type SearchResult =
  | { kind: "test"; item: TestItem; score: number }
  | { kind: "package"; item: PackageItem; score: number };

// Names inside parentheses, e.g. "(CBC)" in "Complete Blood Count (CBC)" - these
// are the abbreviations customers actually type, so they count as aliases.
const PAREN_TOKENS = /\(([^)]+)\)/g;

function lowerAll(values: string[]): string[] {
  return values.map((v) => v.toLowerCase().trim()).filter(Boolean);
}

// Search strings are lowercased ONCE here, at module load, instead of on every
// keystroke for every test. A search then does no string allocation per item.
type TestSearchKeys = { name: string; aliases: string[]; lab: string };
const testSearchKeys = new Map<string, TestSearchKeys>(
  allTests.map((t) => {
    const parenTokens = Array.from(t.name.matchAll(PAREN_TOKENS), (m) => m[1]);
    const aliases = Array.from(new Set(lowerAll([...t.aliases, ...parenTokens])));
    return [t.slug, { name: t.name.toLowerCase(), aliases, lab: t.rawName.toLowerCase() }];
  })
);

// Aliases worth showing as "Also known as" - drops ones the name already
// says (e.g. "CBC" for "Complete Blood Count (CBC)").
export function displayAliases(test: Pick<TestItem, "name" | "aliases">): string[] {
  const name = test.name.toLowerCase();
  return test.aliases.filter((a) => !name.includes(a.toLowerCase()));
}

// Simple, fast relevance score: exact match > starts-with > contains > word overlap.
// `q` must already be lowercased and trimmed; `qWords` are its whitespace-split words.
function scoreLower(n: string, q: string, qWords: string[]): number {
  if (n === q) return 100;
  if (n.startsWith(q)) return 80;
  if (n.includes(q)) return 60;
  let matched = 0;
  for (const w of qWords) if (n.includes(w)) matched++;
  if (matched === 0) return 0;
  return 20 + (matched / qWords.length) * 30;
}

export function search(query: string, limit = 20): SearchResult[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const qWords = q.split(/\s+/).filter(Boolean);
  const results: SearchResult[] = [];

  // Abbreviations and lay terms (e.g. "FBS", "HbA1c") that don't literally
  // appear in the catalog's own test names get a top-tier score so they
  // surface first, ahead of loose text matches.
  const aliasSlugs = new Set(aliasMatchSlugs(q));

  for (const p of allPackages) {
    let score = Math.max(
      scoreLower(p.name.toLowerCase(), q, qWords),
      scoreLower(p.tagline.toLowerCase(), q, qWords) * 0.6,
      scoreLower(p.category.toLowerCase(), q, qWords) * 0.5
    );
    if (aliasSlugs.has(p.slug)) score = Math.max(score, 95);
    if (score > 0) results.push({ kind: "package", item: p, score });
  }
  for (const t of allTests) {
    const keys = testSearchKeys.get(t.slug)!;
    let score = scoreLower(keys.name, q, qWords);
    // An exact alias hit ("cbc", "hemogram") ranks as high as an exact name
    // hit; looser alias matches rank just below the same match on the name.
    for (const a of keys.aliases) {
      const s = scoreLower(a, q, qWords);
      score = Math.max(score, s === 100 ? 100 : s * 0.95);
    }
    // The lab's own name still works, for someone typing what's on a report.
    score = Math.max(score, scoreLower(keys.lab, q, qWords) * 0.75);
    score *= t.popular ? 1.1 : 1;
    if (aliasSlugs.has(t.slug)) score = Math.max(score, 95);
    if (score > 0) results.push({ kind: "test", item: t, score });
  }

  // On equal scores prefer the shorter name - the plain "Complete Blood Count"
  // should come before "Complete Blood Count with ESR" when both match equally.
  results.sort((a, b) => b.score - a.score || a.item.name.length - b.item.name.length);
  return results.slice(0, limit);
}

// Used by the search bar: if there's one clearly best match, we can send the
// user straight to its product page instead of a results list.
export function findConfidentMatch(query: string): SearchResult | null {
  const results = search(query, 5);
  if (results.length === 0) return null;
  const [best, second] = results;
  if (best.score >= 80 && (!second || best.score - second.score >= 15)) return best;
  return null;
}
