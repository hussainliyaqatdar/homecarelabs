// Report turnaround-time estimates, based on general Indian diagnostic-lab
// industry norms for each test category (not vendor-specific data - actual
// times vary by lab and should be confirmed with Agilus). Ordered by
// priority; first match wins. `weight` (in hours, upper bound) is used only
// to pick the slowest constituent when estimating a package's overall ETA.
const RULES = [
  [/nipt|microdeletion/i, { label: "7-10 days", weight: 240 }],
  [/karyotyp|chromosom|\bfish\b|genetic/i, { label: "10-14 days", weight: 336 }],
  [/\bafb\b|tb culture|mycobact/i, { label: "2-4 weeks", weight: 672 }],
  [/biopsy|histopath|cytology|\bfnac\b/i, { label: "3-5 days", weight: 120 }],
  [/double marker|quadruple marker|triple marker/i, { label: "2-3 days", weight: 72 }],
  // "sensitivity"/"susceptibility" alone used to be in this pattern too, but
  // every real culture test already says "culture" as well, and the bare
  // words falsely matched unrelated tests like "High Sensitivity C-Reactive
  // Protein" and "Hypersensitivity Pneumonitis Panel", giving same-day serum
  // tests a fabricated multi-day culture turnaround.
  [/culture/i, { label: "2-3 days", weight: 72 }],
  [/allerg/i, { label: "2-3 days", weight: 72 }],
  [/stool|faecal|fecal/i, { label: "12-24 hours", weight: 24 }],
  [/torch|widal|vdrl|hiv|hbsag|hcv|hepatitis|dengue|malaria|typhoid/i, { label: "12-24 hours", weight: 24 }],
  [/\bana\b|rheumatoid|autoimmune|\bcrp\b/i, { label: "12-24 hours", weight: 24 }],
  [/\bpsa\b|\bca 125\b|\bafp\b|\bcea\b|tumou?r/i, { label: "12-24 hours", weight: 24 }],
  [/vitamin|\btsh\b|\bt3\b|\bt4\b|thyroid|hormone|testosterone|estradiol|prolactin|\bamh\b|\blh\b|\bfsh\b|progesterone|cortisol/i, { label: "12-24 hours", weight: 24 }],
  [/glucose tolerance|\bgtt\b|\bogtt\b/i, { label: "6-9 hours", weight: 9 }],
  [/urine|urinalysis|urinary/i, { label: "6-12 hours", weight: 12 }],
  [/\bpt\b|\binr\b|\baptt\b|coagulat|clotting/i, { label: "6-12 hours", weight: 12 }],
  [/\bcbc\b|hemoglobin|haemoglobin|platelet|\besr\b|blood count/i, { label: "6-12 hours", weight: 12 }],
  [/glucose|sugar|hba1c|electrolyte|creatinine|\bbun\b|urea|uric acid|calcium|liver|kidney|lipid|cholesterol|bilirubin|\balt\b|\bast\b/i, { label: "6-9 hours", weight: 9 }],
];

const DEFAULT_ETA = { label: "12-24 hours", weight: 24 };

function estimateEta(name) {
  for (const [pattern, eta] of RULES) {
    if (pattern.test(name)) return eta;
  }
  return DEFAULT_ETA;
}

module.exports = { estimateEta, DEFAULT_ETA };
