// Doctors a customer can pick for the follow-up consultation on the two
// package-comparison experiment pages (/compare/consult-addon and
// /compare/consult-included).
//
// TODO: PLACEHOLDERS - replace every entry below with the real doctors before
// sharing either page. Keep `id` stable once bookings exist: it is stored on
// each order (alongside a copy of the name).
export type ConsultDoctor = {
  id: string;
  name: string;
  qualification: string;
  specialty: string;
  experience: string;
  languages: string;
};

export const CONSULT_DOCTORS: ConsultDoctor[] = [
  {
    id: "doctor-1",
    name: "Dr.Sreeramappa",
    qualification: "MBBS",
    specialty: "General Physician",
    experience: "30 years experience",
    languages: "Kannada, English",
  },
  {
    id: "doctor-2",
    name: "Dr. Naveeda Banu",
    qualification: "MBBS",
    specialty: "General Physician",
    experience: "15 years experience",
    languages: "Kannada, Hindi, English",
  },
];

// Up to two initials for a doctor's avatar ("Dr. Naveeda Banu" -> "NB").
export function doctorInitials(name: string): string {
  const letters = name
    .replace(/^Dr\.?\s*/i, "")
    .split(/\s+/)
    .map((w) => w.replace(/[^A-Za-z]/g, "")[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("");
  return letters.toUpperCase() || "Dr";
}

export function getConsultDoctor(id: string | undefined): ConsultDoctor | undefined {
  return id ? CONSULT_DOCTORS.find((d) => d.id === id) : undefined;
}
