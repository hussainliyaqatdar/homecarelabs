// Doctor sign-up (/for-doctors): the fields, their limits, and the validation.
// Pure and dependency-free so the exact same checks run in the browser (inline
// errors as the doctor fills the form) and on the server (the authoritative
// check before anything is saved or emailed).

export const DAYS = [
  { id: "mon", label: "Mon" },
  { id: "tue", label: "Tue" },
  { id: "wed", label: "Wed" },
  { id: "thu", label: "Thu" },
  { id: "fri", label: "Fri" },
  { id: "sat", label: "Sat" },
  { id: "sun", label: "Sun" },
] as const;
export type DayId = (typeof DAYS)[number]["id"];
const DAY_IDS: string[] = DAYS.map((d) => d.id);

// Suggestions only - the field accepts any specialty.
export const SPECIALTY_SUGGESTIONS = [
  "General Physician",
  "Gynaecologist",
  "Obstetrician",
  "Diabetologist",
  "Endocrinologist",
  "Cardiologist",
  "Paediatrician",
  "Dermatologist",
  "Orthopaedic Surgeon",
  "ENT Specialist",
  "Psychiatrist",
  "Dietitian / Nutritionist",
];

export const LIMITS = {
  fullName: { min: 2, max: 80 },
  email: { max: 120 },
  specialty: { min: 2, max: 80 },
  degree: { min: 2, max: 120 },
  about: { min: 20, max: 600 },
  notes: { max: 300 },
  maxWindows: 3,
} as const;

export type TimeWindow = { from: string; to: string }; // 24-hour "HH:MM", India time

export type DoctorSignup = {
  fullName: string;
  email: string;
  specialty: string;
  degree: string;
  about: string;
  days: DayId[]; // in week order, no duplicates
  windows: TimeWindow[]; // earliest first, no overlaps
  notes: string;
};

export type DoctorSignupField = "fullName" | "email" | "specialty" | "degree" | "about" | "days" | "windows" | "notes" | "consent";
export type DoctorSignupErrors = Partial<Record<DoctorSignupField, string>>;

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, max + 1) : "";
}

// Keeps line breaks in the free-text intro, but trims the clutter around them.
function paragraph(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, max + 1);
}

export function validateDoctorSignup(raw: unknown): { ok: true; value: DoctorSignup } | { ok: false; errors: DoctorSignupErrors } {
  const input = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const errors: DoctorSignupErrors = {};

  const fullName = text(input.fullName, LIMITS.fullName.max);
  if (fullName.length < LIMITS.fullName.min) errors.fullName = "Enter your full name.";
  else if (fullName.length > LIMITS.fullName.max) errors.fullName = `Keep your name under ${LIMITS.fullName.max} characters.`;

  const email = text(input.email, LIMITS.email.max).toLowerCase();
  if (!email) errors.email = "Enter your email address.";
  else if (email.length > LIMITS.email.max || !EMAIL_RE.test(email)) errors.email = "Enter a valid email address.";

  const specialty = text(input.specialty, LIMITS.specialty.max);
  if (specialty.length < LIMITS.specialty.min) errors.specialty = "Enter your specialty.";
  else if (specialty.length > LIMITS.specialty.max) errors.specialty = `Keep this under ${LIMITS.specialty.max} characters.`;

  const degree = text(input.degree, LIMITS.degree.max);
  if (degree.length < LIMITS.degree.min) errors.degree = "Enter your degree(s), e.g. MBBS, MD.";
  else if (degree.length > LIMITS.degree.max) errors.degree = `Keep this under ${LIMITS.degree.max} characters.`;

  const about = paragraph(input.about, LIMITS.about.max);
  if (about.length < LIMITS.about.min) errors.about = `Add a short intro (at least ${LIMITS.about.min} characters).`;
  else if (about.length > LIMITS.about.max) errors.about = `Keep your intro under ${LIMITS.about.max} characters.`;

  const dayInput = Array.isArray(input.days) ? input.days : [];
  const days = DAY_IDS.filter((id) => dayInput.includes(id)) as DayId[];
  if (days.length === 0) errors.days = "Pick at least one day.";

  const windowInput = Array.isArray(input.windows) ? input.windows : [];
  const windows: TimeWindow[] = [];
  let windowError = "";
  if (windowInput.length === 0) windowError = "Add your available hours.";
  else if (windowInput.length > LIMITS.maxWindows) windowError = `Add up to ${LIMITS.maxWindows} time slots.`;
  else {
    for (const w of windowInput) {
      const from = w && typeof w === "object" ? (w as Record<string, unknown>).from : undefined;
      const to = w && typeof w === "object" ? (w as Record<string, unknown>).to : undefined;
      if (typeof from !== "string" || typeof to !== "string" || !TIME_RE.test(from) || !TIME_RE.test(to)) {
        windowError = "Fill in both start and end times.";
        break;
      }
      if (from >= to) {
        windowError = "End time must be after start time.";
        break;
      }
      windows.push({ from, to });
    }
    windows.sort((a, b) => a.from.localeCompare(b.from));
    if (!windowError && windows.some((w, i) => i > 0 && w.from < windows[i - 1].to)) windowError = "Time slots can't overlap.";
  }
  if (windowError) errors.windows = windowError;

  const notes = paragraph(input.notes, LIMITS.notes.max);
  if (notes.length > LIMITS.notes.max) errors.notes = `Keep this under ${LIMITS.notes.max} characters.`;

  if (input.consent !== true) errors.consent = "Tick to continue.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, value: { fullName, email, specialty, degree, about, days, windows, notes } };
}

// "09:00" -> "9:00 AM"
export function to12Hour(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, "0")} ${suffix}`;
}

export function formatDays(days: DayId[]): string {
  return days.map((d) => DAYS.find((x) => x.id === d)!.label).join(", ");
}

export function formatWindows(windows: TimeWindow[]): string {
  return windows.map((w) => `${to12Hour(w.from)} - ${to12Hour(w.to)}`).join("; ");
}
