// Content for the Full Body Checkup comparison pages (/compare/*), transcribed
// from the lab's tier comparison chart. Prices and MRPs are NOT stored here -
// they come from the catalog packages named in `slugs`, so the page, the cart
// and the product pages can never disagree.

export type Gender = "men" | "women";
export type PlanId = "essential" | "advanced" | "pro" | "pro-max" | "ultra";

export type ComparePlan = {
  id: PlanId;
  name: string;
  // Lab parameters in the plan (from the chart's "Test Parameters" row).
  parameters: number;
  // Catalog package to book, per gender. Pro Max and Ultra differ by one
  // cancer marker, so they are separate packages; the others are the same.
  slugs: Record<Gender, string>;
};

export const COMPARE_PLANS: ComparePlan[] = [
  { id: "essential", name: "Essential", parameters: 87, slugs: { men: "full-body-checkup-essential", women: "full-body-checkup-essential" } },
  { id: "advanced", name: "Advanced", parameters: 89, slugs: { men: "full-body-checkup-advanced", women: "full-body-checkup-advanced" } },
  { id: "pro", name: "Pro", parameters: 92, slugs: { men: "full-body-checkup-pro", women: "full-body-checkup-pro" } },
  { id: "pro-max", name: "Pro Max", parameters: 97, slugs: { men: "full-body-checkup-pro-max-men", women: "full-body-checkup-pro-max-women" } },
  { id: "ultra", name: "Ultra", parameters: 100, slugs: { men: "full-body-checkup-ultra-men", women: "full-body-checkup-ultra-women" } },
];

// The only packages an offer may be attached to (checked again on the server).
export const COMPARE_PACKAGE_SLUGS: string[] = Array.from(
  new Set(COMPARE_PLANS.flatMap((p) => [p.slugs.men, p.slugs.women]))
);

// "alt" = included, but in the variant described by the row's `altNote`.
export type Cell = "yes" | "no" | "alt";

// The body part or condition a test is about - drawn as an icon beside the test
// name (components/OrganIcon.tsx), so the table reads at a glance.
export type OrganKey = "blood" | "diabetes" | "heart" | "liver" | "kidney" | "thyroid" | "bone" | "brain" | "ribbon" | "doctor";

export type CompareRow = {
  label: string;
  hint: string;
  organ: OrganKey;
  // One cell per plan, in COMPARE_PLANS order.
  cells: [Cell, Cell, Cell, Cell, Cell];
  altNote?: string;
};

export const COMPARE_ROWS: CompareRow[] = [
  { label: "CBC", hint: "General well-being", organ: "blood", cells: ["yes", "yes", "yes", "yes", "yes"] },
  { label: "Fasting Glucose", hint: "Diabetes", organ: "diabetes", cells: ["yes", "yes", "yes", "yes", "yes"] },
  { label: "HbA1c", hint: "Diabetes", organ: "diabetes", cells: ["yes", "yes", "yes", "yes", "yes"] },
  { label: "Lipid Profile", hint: "Heart", organ: "heart", cells: ["yes", "yes", "yes", "yes", "yes"] },
  { label: "Liver Profile (LFT)", hint: "Liver", organ: "liver", cells: ["yes", "yes", "yes", "yes", "yes"] },
  { label: "Kidney Profile (KFT)", hint: "Kidney", organ: "kidney", cells: ["yes", "yes", "yes", "yes", "yes"] },
  {
    label: "Thyroid Profile",
    hint: "Thyroid",
    organ: "thyroid",
    cells: ["alt", "alt", "alt", "yes", "yes"],
    altNote: "T3, T4 & TSH instead of FT3, FT4 & TSH",
  },
  { label: "Calcium", hint: "Bone health", organ: "bone", cells: ["yes", "yes", "yes", "yes", "yes"] },
  { label: "Urinalysis", hint: "Kidney", organ: "kidney", cells: ["yes", "yes", "yes", "yes", "yes"] },
  { label: "Vitamin D", hint: "Bone health", organ: "bone", cells: ["no", "yes", "yes", "yes", "yes"] },
  { label: "Vitamin B12", hint: "Nerve & anaemia", organ: "brain", cells: ["no", "yes", "yes", "yes", "yes"] },
  { label: "Iron", hint: "Anaemia", organ: "blood", cells: ["no", "no", "yes", "yes", "yes"] },
  {
    label: "hs-CRP / CRP",
    hint: "Heart",
    organ: "heart",
    cells: ["no", "no", "alt", "alt", "yes"],
    altNote: "CRP instead of hs-CRP",
  },
  { label: "Phosphorus", hint: "Bone health", organ: "bone", cells: ["no", "no", "no", "yes", "yes"] },
  { label: "TIBC", hint: "Anaemia", organ: "blood", cells: ["no", "no", "no", "yes", "yes"] },
  { label: "Magnesium", hint: "Muscle & heart", organ: "heart", cells: ["no", "no", "no", "yes", "yes"] },
  { label: "Folic Acid", hint: "Anaemia", organ: "blood", cells: ["no", "no", "no", "no", "yes"] },
  { label: "RA Factor", hint: "Bone & joints", organ: "bone", cells: ["no", "no", "no", "no", "yes"] },
  { label: "Cortisol", hint: "Stress", organ: "brain", cells: ["no", "no", "no", "no", "yes"] },
];

// Pro Max and Ultra add one cancer marker, which depends on gender.
export const CANCER_MARKER: Record<Gender, string> = {
  men: "PSA (Prostate)",
  women: "CA 125 (Ovary)",
};
export const CANCER_MARKER_PLANS: PlanId[] = ["pro-max", "ultra"];

export const COMPARE_FOOTNOTE = "Parameters may vary by city. T&C apply.";
