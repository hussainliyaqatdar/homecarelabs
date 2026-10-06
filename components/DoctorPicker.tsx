"use client";
import { CONSULT_DOCTORS, doctorInitials } from "@/lib/consult-doctors";

// Radio list of the doctors available for the follow-up consultation.
export default function DoctorPicker({ value, onChange }: { value: string | null; onChange: (doctorId: string) => void }) {
  return (
    <div role="radiogroup" aria-label="Choose your doctor" className="grid gap-3 sm:grid-cols-2">
      {CONSULT_DOCTORS.map((d) => (
        <label key={d.id} className="block cursor-pointer">
          <input type="radio" name="consult-doctor" checked={value === d.id} onChange={() => onChange(d.id)} className="peer sr-only" />
          <div className="flex items-start gap-3 rounded-xl border bg-white p-3 transition hover:border-brand peer-checked:border-brand peer-checked:bg-brand-light peer-checked:ring-2 peer-checked:ring-brand peer-focus-visible:ring-2 peer-focus-visible:ring-brand">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white" aria-hidden="true">
              {doctorInitials(d.name)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center justify-between gap-2">
                <span className="font-semibold text-gray-900">{d.name}</span>
                {value === d.id && <span className="shrink-0 rounded-full bg-brand px-2 py-0.5 text-xs font-semibold text-white">Selected</span>}
              </span>
              <span className="block text-sm text-gray-600">
                {d.qualification} &middot; {d.specialty}
              </span>
              <span className="block text-xs text-gray-500">
                {d.experience} &middot; {d.languages}
              </span>
            </span>
          </div>
        </label>
      ))}
    </div>
  );
}
