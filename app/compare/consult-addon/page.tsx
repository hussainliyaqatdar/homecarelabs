import type { Metadata } from "next";
import PackageComparison from "@/components/PackageComparison";

// Experiment variant A: follow-up consultation is an optional Rs. 500 add-on.
// Not indexed - it is an ad landing page, and near-duplicates the other variant.
export const metadata: Metadata = {
  title: "Exclusive Full Body Checkup Packages",
  description: "Compare our Full Body Checkup plans side by side and add an optional follow-up consultation with a doctor.",
  robots: { index: false, follow: false },
};

export default function ConsultAddonPage() {
  return <PackageComparison variant="addon" />;
}
