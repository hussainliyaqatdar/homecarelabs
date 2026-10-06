import type { Metadata } from "next";
import PackageComparison from "@/components/PackageComparison";

// Experiment variant B: every plan bundles a follow-up consultation, at a price
// rounded up to the next Rs. 1,000. Not indexed - see the add-on variant.
export const metadata: Metadata = {
  title: "Exclusive Full Body Checkup Packages",
  description: "Compare our Full Body Checkup plans side by side - every plan includes a follow-up consultation with a doctor.",
  robots: { index: false, follow: false },
};

export default function ConsultIncludedPage() {
  return <PackageComparison variant="included" />;
}
