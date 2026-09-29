// Keyword-pattern fallback for the long tail of "Specialised" catalog tests
// that don't have a hand-curated description. Ordered by priority - first
// matching pattern wins. Written for a layman, benefit-first, well under the
// site's 70-word cap, and deliberately conservative in clinical claims since
// these are auto-generated rather than individually reviewed.
const RULES = [
  [/vitamin/i, (n) => `Checks your ${cleanName(n)} levels. Useful if your doctor suspects a deficiency, or wants a fuller picture as part of a nutrition or metabolic checkup.`],
  // "sensitivity"/"susceptibility" alone used to be in this pattern too, but
  // every real culture test already says "culture" as well, and the bare
  // words falsely matched unrelated tests like "High Sensitivity C-Reactive
  // Protein", giving a same-day inflammation marker a fabricated "grows
  // bacteria" description that belongs to microbiology culture tests.
  [/culture/i, (n) => `Grows any bacteria or organisms present in your sample to confirm an infection - and shows exactly which antibiotics will actually work against it.`],
  [/biopsy|cytology|fnac|histopath/i, (n) => `A pathologist examines a small tissue or cell sample under the microscope to confirm or rule out a diagnosis. Your doctor will guide you on collection specifics.`],
  [/\bpcr\b|molecular|dna|rna/i, (n) => `A fast, highly accurate molecular (PCR) test that detects an organism's genetic material directly, for quick and reliable confirmation of infection.`],
  [/antibod(y|ies)|\bigg\b|\bigm\b|\bige\b|\biga\b/i, (n) => `Checks for antibodies related to ${cleanName(n)}, showing your doctor whether you've been exposed to it recently, in the past, or not at all.`],
  [/antigen/i, (n) => `Detects ${cleanName(n)} directly in your sample, helping confirm an active infection or specific condition as part of your diagnostic workup.`],
  [/allerg/i, (n) => `Checks how sensitised your immune system is to specific triggers, helping explain symptoms like skin reactions, sneezing, or breathing difficulty.`],
  [/panel|profile|screen\b/i, (n) => `A set of related tests run together so your doctor gets the fuller picture needed for diagnosis or monitoring, rather than just one isolated number.`],
  [/tumor|tumour|marker|\bca \d|\bafp\b|\bcea\b|\bpsa\b/i, (n) => `A tumour marker that helps track a known condition or how well treatment is working. Always read alongside imaging and your doctor's clinical judgement, not on its own.`],
  [/c-reactive protein|\bcrp\b/i, (n) => `Checks C-reactive protein (CRP), a marker of inflammation in your body - useful for assessing heart disease risk or tracking an ongoing inflammatory condition.`],
  [/hormone|testosterone|estrogen|oestrogen|progesterone|cortisol|acth|prolactin|\bfsh\b|\blh\b|thyroid|\btsh\b|\bt3\b|\bt4\b/i, (n) => `Checks your ${cleanName(n)} level, part of the hormone picture your doctor uses to understand energy, metabolism, mood, or reproductive health.`],
  [/urine|urinary/i, (n) => `A urine-based test that helps your doctor check kidney function, catch an infection, or screen for a specific substance.`],
  [/stool|faecal|fecal/i, (n) => `A stool-based test that helps investigate ongoing digestive symptoms, infection, or unexplained bleeding in the gut.`],
  [/csf|spinal fluid|pleural|ascitic|body fluid/i, (n) => `Lab analysis of a body fluid sample, usually collected by a specialist, to help diagnose infection or inflammation in that specific area.`],
  [/\bpt\b|\baptt\b|\binr\b|coagulat|clotting|bleeding time|fibrinogen/i, (n) => `Checks how well your blood clots - useful before surgery, for liver health, or to keep an eye on blood-thinning medication.`],
  [/electrolyte|sodium|potassium|chloride|calcium|magnesium|phosphorus/i, (n) => `Checks your ${cleanName(n)} level, a mineral that keeps your muscles, nerves, and organs working properly - often part of a metabolic or kidney checkup.`],
  [/culture|smear|stain|\bafb\b|gram stain/i, (n) => `A microscope-based test that identifies infectious organisms directly in your sample, helping guide the right treatment.`],
  [/genetic|karyotype|chromosom|mutation/i, (n) => `A specialised genetic test used to investigate an inherited condition or confirm a diagnosis, typically ordered by a specialist.`],
  [/count|absolute|smear/i, (n) => `A blood cell count that, alongside your other results, helps your doctor assess infection, inflammation, allergy, or a blood disorder.`],
  [/drug level|therapeutic|toxicology/i, (n) => `Measures the level of a specific medicine or substance in your blood, helping your doctor get your dose exactly right.`],
];

const SPECIMEN_SUFFIX = /,?\s*(serum|plasma|blood|urine|whole blood|edta whole blood|citrate plasma|fluoride plasma|spinal fluid|body fluid|stool|fluid)\s*$/i;

function cleanName(name) {
  return name
    .replace(/\(.*?\)/g, "")
    .replace(SPECIMEN_SUFFIX, "")
    .trim();
}

function fallbackDescription(name) {
  for (const [pattern, fn] of RULES) {
    if (pattern.test(name)) return fn(name);
  }
  return `A specialised test your doctor may order as part of a targeted diagnostic workup. Ask your doctor how the ${cleanName(name)} result applies to your specific symptoms.`;
}

module.exports = { fallbackDescription, cleanName };
