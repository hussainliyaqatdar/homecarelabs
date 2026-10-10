import { Fragment } from "react";
import type { Metadata } from "next";
import DoctorSignupForm from "@/components/DoctorSignupForm";

// Not indexed: this is a page to send to doctors, not part of the patient-facing
// site's search presence. Remove `robots` to let search engines list it.
export const metadata: Metadata = {
  title: "Join as a consulting doctor",
  description: "Get discovered by patients who invest in their health proactively.",
  robots: { index: false, follow: false },
};

const PERKS = ["Patients arrive with their reports", "You choose your hours", "Consult from anywhere"];

// Sign up -> we set you up -> go live -> patients book you.
const FLOW = [
  {
    label: "Sign up",
    note: "2 mins",
    icon: <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M9 13h6M9 17h4" />,
  },
  {
    label: "We set you up",
    note: "Profile + calendar",
    icon: <path d="M3 5h18v16H3zM3 10h18M8 3v4M16 3v4" />,
  },
  {
    label: "Go live",
    note: "In 48 hrs",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12.5l3 3 5-6" />
      </>
    ),
  },
  {
    label: "Consult patients",
    note: "Online",
    icon: <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" />,
  },
];

const Check = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-brand" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

export default function ForDoctorsPage() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[1fr_minmax(0,32rem)] lg:items-start lg:gap-14">
      <div className="flex flex-col gap-7">
        <header className="flex flex-col gap-4">
          <span className="w-fit rounded-full bg-brand-light px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-dark">
            For doctors
          </span>
          <h1 className="text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
            Get discovered by patients who invest in their health proactively
          </h1>
          <ul className="flex flex-col gap-2 text-gray-800">
            {PERKS.map((perk) => (
              <li key={perk} className="flex items-center gap-2">
                <Check />
                {perk}
              </li>
            ))}
          </ul>
          <a href="#signup" className="w-fit rounded-lg bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-dark lg:hidden">
            Sign up in 2 minutes
          </a>
        </header>

        <section aria-labelledby="how-it-works" className="rounded-2xl border bg-white p-4 md:p-5">
          <h2 id="how-it-works" className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
            How it works
          </h2>
          <ol className="flex items-start">
            {FLOW.map((step, i) => (
              <Fragment key={step.label}>
                {i > 0 && (
                  <li aria-hidden="true" className="mt-3 shrink-0 px-0.5 text-brand/40 sm:px-1.5">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </li>
                )}
                <li className="flex min-w-0 flex-1 flex-col items-center gap-1.5 text-center">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-light text-brand" aria-hidden="true">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      {step.icon}
                    </svg>
                  </span>
                  <span className="text-sm font-semibold leading-tight text-gray-900">{step.label}</span>
                  <span className="text-xs leading-tight text-gray-500">{step.note}</span>
                </li>
              </Fragment>
            ))}
          </ol>
        </section>
      </div>

      <div id="signup" className="scroll-mt-24">
        <DoctorSignupForm />
      </div>
    </div>
  );
}
