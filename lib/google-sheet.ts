// Records doctor sign-ups in a Google Sheet, through a small Google Apps Script
// attached to that sheet (scripts/google-apps-script/doctor-signups.gs), which
// the site calls over HTTPS. Setup is in that file's header.
//
//   DOCTOR_SHEET_WEBHOOK_URL     the Apps Script web-app URL ("Deploy > Web app")
//   DOCTOR_SHEET_WEBHOOK_SECRET  a shared secret, also saved in the script's properties
import { formatDays, formatWindows, type DoctorSignup } from "./doctor-onboarding";
import { saveDoctorSignup } from "./store";

// Column order in the sheet. The script writes these as the header row when the
// sheet is empty, so the columns are defined here and only here.
export const DOCTOR_SHEET_COLUMNS = [
  "Submitted at (IST)",
  "Status",
  "Full name",
  "Email",
  "Specialty",
  "Degree",
  "About me",
  "Available days",
  "Time windows (IST)",
  "Availability notes",
] as const;

export function istTimestamp(date = new Date()): string {
  return date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" });
}

export function doctorSheetValues(signup: DoctorSignup, submittedAt: string): string[] {
  return [
    submittedAt,
    "New", // the team changes this to "Live" once the calendar is set up
    signup.fullName,
    signup.email,
    signup.specialty,
    signup.degree,
    signup.about,
    formatDays(signup.days),
    formatWindows(signup.windows),
    signup.notes,
  ];
}

// Saves the sign-up. Resolves with where it went; rejects if it could not be
// saved, so the doctor is told to try again instead of being sent a confirmation
// for details we do not have.
export async function recordDoctorSignup(signup: DoctorSignup, submittedAt: string): Promise<"sheet" | "local"> {
  const values = doctorSheetValues(signup, submittedAt);
  const url = process.env.DOCTOR_SHEET_WEBHOOK_URL;
  const secret = process.env.DOCTOR_SHEET_WEBHOOK_SECRET;

  if (!url || !secret) {
    // The server's disk is wiped on every restart in production, so never let a
    // sign-up quietly land there - fail loudly until the sheet is configured.
    if (process.env.NODE_ENV === "production") {
      throw new Error("Doctor sign-up sheet is not configured (set DOCTOR_SHEET_WEBHOOK_URL and DOCTOR_SHEET_WEBHOOK_SECRET).");
    }
    console.warn("[doctor sign-up] No Google Sheet configured - saving to .data/doctor-signups.json instead.");
    saveDoctorSignup(Object.fromEntries(DOCTOR_SHEET_COLUMNS.map((c, i) => [c, values[i]])));
    return "local";
  }

  // Apps Script answers a POST with a redirect to the page holding its reply, so
  // redirects must be followed.
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ secret, columns: DOCTOR_SHEET_COLUMNS, values }),
    redirect: "follow",
    signal: AbortSignal.timeout(20_000),
  });
  const reply = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
  if (!res.ok || !reply?.ok) {
    throw new Error(`Google Sheet rejected the sign-up: ${reply?.error ?? `HTTP ${res.status}`}`);
  }
  return "sheet";
}
