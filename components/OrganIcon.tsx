import type { OrganKey } from "@/lib/checkup-compare";

// Line icons for the organ or condition a test is about. All drawn on a 24x24
// grid with the same stroke, so they read as one set. They are decorative: the
// test's name and its short description sit right beside them.
const PATHS: Record<OrganKey, React.ReactNode> = {
  // Blood drop.
  blood: <path d="M12 3.2c-3.3 3.9-6 6.9-6 10.4a6 6 0 0 0 12 0c0-3.5-2.7-6.5-6-10.4z" />,
  // Glucose meter (screen, button, test strip) with a drop beside it: the diabetes check.
  diabetes: (
    <>
      <rect x="4.5" y="9.5" width="10" height="12.5" rx="2" />
      <rect x="6.8" y="12" width="5.4" height="3.6" rx=".7" />
      <circle cx="9.5" cy="18.8" r="1.2" />
      <path d="M8.2 9.5V5.8h2.6v3.7" />
      <path d="M18 3.2c-1.3 1.5-2.2 2.5-2.2 3.7a2.2 2.2 0 0 0 4.4 0c0-1.2-.9-2.2-2.2-3.7z" />
    </>
  ),
  // Heart.
  heart: <path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7 7-7z" />,
  // Liver: large lobe on the right tapering to the left, with the dividing notch.
  liver: (
    <>
      <path d="M2.5 10.3C5 7.2 9 6 13 6.3c4.6.3 8.2 3.1 8.2 7 0 3.3-2.5 5.4-5.8 5.4-2.7 0-3.8-1.6-5.4-2.9-1.2-1-3.2-1.2-4.7-2-1.8-.9-2.8-2.1-2.8-3.5z" />
      <path d="M11.5 6.4c.3 1.6.2 3.2-.4 4.6" />
    </>
  ),
  // Kidney bean with the inner notch.
  kidney: <path d="M15 3.4c-3.8-.5-6.8 1.8-6.8 5.3 0 1.8 1.3 2.6 1.3 3.7s-1.4 1.8-1.4 3.4c0 2.8 2.5 4.9 5.3 4.9 3.6 0 6.1-3.1 6.1-7.3 0-4.3-1.8-9.4-4.5-10z" />,
  // Thyroid: the butterfly of two lobes joined by a narrow bridge.
  thyroid: (
    <path d="M12 12.2C11 9.2 9 6.3 6.8 6.5 4.8 6.7 4 9 4.6 12c.6 3.2 2.3 5.8 4.4 5.7 1.6-.1 2-1.4 2-2.9 0-.5.3-.8 1-.8s1 .3 1 .8c0 1.5.4 2.8 2 2.9 2.1.1 3.8-2.5 4.4-5.7.6-3-.2-5.3-2.2-5.5-2.2-.2-4.2 2.7-5.2 5.7z" />
  ),
  // Bone.
  bone: (
    <path d="M17 10c.7-.7 1.7 0 2.5 0a2.5 2.5 0 1 0 0-5 .5.5 0 0 1-.5-.5 2.5 2.5 0 1 0-5 0c0 .8.7 1.8 0 2.5l-7 7c-.7.7-1.7 0-2.5 0a2.5 2.5 0 0 0 0 5c.3 0 .5.2.5.5a2.5 2.5 0 1 0 5 0c0-.8-.7-1.8 0-2.5z" />
  ),
  // Brain (nerves, stress).
  brain: (
    <>
      <path d="M12 5.2c-.5-.9-1.5-1.5-2.6-1.5A3.2 3.2 0 0 0 6.2 6.8 3.3 3.3 0 0 0 4 10c0 1 .4 1.9 1.1 2.5A3.3 3.3 0 0 0 5.6 17 3.1 3.1 0 0 0 9 19.5c1 0 2-.5 3-1.5z" />
      <path d="M12 5.2c.5-.9 1.5-1.5 2.6-1.5a3.2 3.2 0 0 1 3.2 3.1A3.3 3.3 0 0 1 20 10c0 1-.4 1.9-1.1 2.5a3.3 3.3 0 0 1-.5 4.5 3.1 3.1 0 0 1-3.4 2.5c-1 0-2-.5-3-1.5z" />
      <path d="M9 9.5c1 .3 2 .3 3 0" />
      <path d="M12 13.5c1 .3 2 .3 3 0" />
    </>
  ),
  // Awareness ribbon (cancer markers).
  ribbon: (
    <>
      <path d="M12 2.5c-2.3 0-4 1.7-4 3.9 0 3.4 4 6.1 4 6.1s4-2.7 4-6.1c0-2.2-1.7-3.9-4-3.9z" />
      <path d="M12 12.5 7.5 21" />
      <path d="M12 12.5 16.5 21" />
    </>
  ),
  // Medical cross (the doctor consultation).
  doctor: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v9M7.5 12h9" />
    </>
  ),
};

export default function OrganIcon({ name, className = "h-5 w-5" }: { name: OrganKey; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  );
}

// The round badge the icon sits in, in the table's row headings.
export function OrganBadge({ name }: { name: OrganKey }) {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-light text-brand">
      <OrganIcon name={name} className="h-5 w-5" />
    </span>
  );
}
