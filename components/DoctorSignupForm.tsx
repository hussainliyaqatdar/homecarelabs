"use client";
import { useRef, useState } from "react";
import {
  DAYS,
  LIMITS,
  SPECIALTY_SUGGESTIONS,
  validateDoctorSignup,
  type DayId,
  type DoctorSignupErrors,
  type DoctorSignupField,
  type TimeWindow,
} from "@/lib/doctor-onboarding";

type FormState = {
  fullName: string;
  email: string;
  specialty: string;
  degree: string;
  about: string;
  days: DayId[];
  windows: TimeWindow[];
  notes: string;
  consent: boolean;
  website: string; // honeypot: left empty by people
};

const INITIAL: FormState = {
  fullName: "",
  email: "",
  specialty: "",
  degree: "",
  about: "",
  days: [],
  windows: [{ from: "09:00", to: "12:00" }],
  notes: "",
  consent: false,
  website: "",
};

// Order the fields appear in, so the first problem can be brought into view.
const FIELD_ORDER: DoctorSignupField[] = ["fullName", "email", "specialty", "degree", "about", "days", "windows", "notes", "consent"];

const inputClass = (invalid: boolean) =>
  `w-full rounded-lg border bg-white px-3 py-2.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand ${
    invalid ? "border-red-400" : "border-gray-300"
  }`;

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-semibold text-gray-900">
        {label}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="text-xs text-gray-500">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default function DoctorSignupForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<DoctorSignupErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [done, setDone] = useState<{ name: string; email: string } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    // Clear a field's error as soon as the doctor edits it.
    if (key in errors) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function toggleDay(id: DayId) {
    set("days", form.days.includes(id) ? form.days.filter((d) => d !== id) : [...form.days, id]);
  }

  function setWindow(index: number, key: keyof TimeWindow, value: string) {
    set(
      "windows",
      form.windows.map((w, i) => (i === index ? { ...w, [key]: value } : w))
    );
  }

  function focusFirstError(found: DoctorSignupErrors) {
    const first = FIELD_ORDER.find((f) => found[f]);
    if (!first) return;
    // After the errors have rendered.
    setTimeout(() => {
      const el = document.getElementById(`field-${first}`);
      el?.scrollIntoView({ block: "center", behavior: "smooth" });
      el?.focus({ preventScroll: true });
    }, 0);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitError("");

    const result = validateDoctorSignup(form);
    if (!result.ok) {
      setErrors(result.errors);
      focusFirstError(result.errors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const res = await fetch("/api/doctors/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setDone({ name: result.value.fullName, email: result.value.email });
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      if (data.errors) {
        setErrors(data.errors);
        focusFirstError(data.errors);
      }
      setSubmitError(data.error || "Something went wrong. Please try again.");
    } catch {
      setSubmitError("We couldn't reach the server. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border bg-white p-6 md:p-8 text-center flex flex-col items-center gap-3" role="status">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white" aria-hidden="true">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </span>
        <h2 className="text-2xl font-bold text-gray-900">Thank you, {done.name}!</h2>
        <p className="text-gray-700">
          We've received your details. <strong>You'll go live within 48 hours.</strong>
        </p>
        <p className="text-sm text-gray-600">
          Confirmation sent to <strong>{done.email}</strong>. Check spam if it doesn't arrive.
        </p>
      </div>
    );
  }

  const windowsError = errors.windows;

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="rounded-2xl border bg-white p-5 md:p-7 flex flex-col gap-5 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900">Join in 2 minutes</h2>

      {/* Honeypot - hidden from people, bots tend to fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => set("website", e.target.value)} />
        </label>
      </div>

      <Field id="field-fullName" label="Full name" error={errors.fullName}>
        <input
          id="field-fullName"
          type="text"
          autoComplete="name"
          placeholder="e.g. Dr. Asha Rao"
          maxLength={LIMITS.fullName.max}
          value={form.fullName}
          onChange={(e) => set("fullName", e.target.value)}
          aria-invalid={errors.fullName ? true : undefined}
          aria-describedby={errors.fullName ? "field-fullName-error" : undefined}
          className={inputClass(!!errors.fullName)}
        />
      </Field>

      <Field id="field-email" label="Email" hint="Used to schedule your tele-consults." error={errors.email}>
        <input
          id="field-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          maxLength={LIMITS.email.max}
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={`field-email-hint${errors.email ? " field-email-error" : ""}`}
          className={inputClass(!!errors.email)}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="field-specialty" label="Specialty" error={errors.specialty}>
          <input
            id="field-specialty"
            type="text"
            list="specialty-options"
            placeholder="e.g. General Physician"
            maxLength={LIMITS.specialty.max}
            value={form.specialty}
            onChange={(e) => set("specialty", e.target.value)}
            aria-invalid={errors.specialty ? true : undefined}
            aria-describedby={errors.specialty ? "field-specialty-error" : undefined}
            className={inputClass(!!errors.specialty)}
          />
          <datalist id="specialty-options">
            {SPECIALTY_SUGGESTIONS.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </Field>

        <Field id="field-degree" label="Degree(s)" error={errors.degree}>
          <input
            id="field-degree"
            type="text"
            placeholder="e.g. MBBS, MD (General Medicine)"
            maxLength={LIMITS.degree.max}
            value={form.degree}
            onChange={(e) => set("degree", e.target.value)}
            aria-invalid={errors.degree ? true : undefined}
            aria-describedby={errors.degree ? "field-degree-error" : undefined}
            className={inputClass(!!errors.degree)}
          />
        </Field>
      </div>

      <Field id="field-about" label="About me" hint="Shown to patients. Keep it short." error={errors.about}>
        <textarea
          id="field-about"
          rows={4}
          maxLength={LIMITS.about.max}
          value={form.about}
          onChange={(e) => set("about", e.target.value)}
          aria-invalid={errors.about ? true : undefined}
          aria-describedby={`field-about-hint${errors.about ? " field-about-error" : ""}`}
          className={inputClass(!!errors.about)}
        />
        <p className="text-right text-xs text-gray-400">
          {form.about.length}/{LIMITS.about.max}
        </p>
      </Field>

      <fieldset className="flex flex-col gap-3 rounded-xl border bg-gray-50 p-4">
        <legend className="px-1 text-sm font-semibold text-gray-900">Availability (IST)</legend>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-gray-800">Days</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Available days">
            {DAYS.map((d, i) => {
              const on = form.days.includes(d.id);
              return (
                <button
                  key={d.id}
                  id={i === 0 ? "field-days" : undefined}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggleDay(d.id)}
                  className={`min-w-[3.25rem] rounded-full border px-3 py-2 text-sm font-medium transition ${
                    on ? "border-brand bg-brand text-white" : "border-gray-300 bg-white text-gray-700 hover:border-brand"
                  }`}
                >
                  {d.label}
                </button>
              );
            })}
          </div>
          <div className="flex gap-3 text-xs">
            <button type="button" onClick={() => set("days", ["mon", "tue", "wed", "thu", "fri"])} className="font-medium text-brand hover:underline">
              Mon-Fri
            </button>
            <button type="button" onClick={() => set("days", DAYS.map((d) => d.id))} className="font-medium text-brand hover:underline">
              Every day
            </button>
            <button type="button" onClick={() => set("days", [])} className="text-gray-500 hover:underline">
              Clear
            </button>
          </div>
          {errors.days && (
            <p role="alert" className="text-xs text-red-600">
              {errors.days}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-gray-800">Hours</p>
          {form.windows.map((w, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                id={i === 0 ? "field-windows" : undefined}
                type="time"
                aria-label={`Window ${i + 1} start time`}
                value={w.from}
                onChange={(e) => setWindow(i, "from", e.target.value)}
                aria-invalid={windowsError ? true : undefined}
                className={`${inputClass(!!windowsError)} min-w-0 flex-1`}
              />
              <span className="text-sm text-gray-500">to</span>
              <input
                type="time"
                aria-label={`Window ${i + 1} end time`}
                value={w.to}
                onChange={(e) => setWindow(i, "to", e.target.value)}
                aria-invalid={windowsError ? true : undefined}
                className={`${inputClass(!!windowsError)} min-w-0 flex-1`}
              />
              {form.windows.length > 1 && (
                <button
                  type="button"
                  onClick={() => set("windows", form.windows.filter((_, j) => j !== i))}
                  aria-label={`Remove window ${i + 1}`}
                  className="shrink-0 rounded-md p-2 text-gray-400 hover:bg-white hover:text-red-500"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
          {form.windows.length < LIMITS.maxWindows && (
            <button
              type="button"
              onClick={() => set("windows", [...form.windows, { from: "17:00", to: "19:00" }])}
              className="w-fit text-sm font-medium text-brand hover:underline"
            >
              + Add hours
            </button>
          )}
          {windowsError && (
            <p role="alert" className="text-xs text-red-600">
              {windowsError}
            </p>
          )}
        </div>

        <Field id="field-notes" label="Notes (optional)" error={errors.notes}>
          <textarea
            id="field-notes"
            rows={2}
            maxLength={LIMITS.notes.max}
            placeholder="e.g. No alternate Saturdays"
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            aria-invalid={errors.notes ? true : undefined}
            className={inputClass(!!errors.notes)}
          />
        </Field>
      </fieldset>

      <div className="flex flex-col gap-1">
        <label className="flex cursor-pointer items-start gap-3 text-sm text-gray-700">
          <input
            id="field-consent"
            type="checkbox"
            checked={form.consent}
            onChange={(e) => set("consent", e.target.checked)}
            aria-invalid={errors.consent ? true : undefined}
            className="mt-0.5 h-5 w-5 shrink-0 accent-[#0F6E6E]"
          />
          <span>I agree to my name, specialty and intro being shown to patients, and to be contacted by email.</span>
        </label>
        {errors.consent && (
          <p role="alert" className="text-xs text-red-600">
            {errors.consent}
          </p>
        )}
      </div>

      {submitError && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-brand px-5 py-3.5 text-base font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Submitting..." : "Submit my details"}
      </button>
      <p className="-mt-2 text-center text-xs text-gray-500">You'll get a confirmation email and go live within 48 hours.</p>
    </form>
  );
}
