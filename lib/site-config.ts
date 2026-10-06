export const BUSINESS_NAME = process.env.BUSINESS_NAME || "Agilus (SRL) Diagnostics";
export const BOOKING_PHONE = process.env.BOOKING_PHONE || "+91 70197 64500";
export const BOOKING_PHONE_TEL = BOOKING_PHONE.replace(/[^\d+]/g, "");
// Same number handles both calls and WhatsApp chat; wa.me needs digits only, no "+".
export const WHATSAPP_NUMBER = BOOKING_PHONE_TEL.replace(/^\+/, "");
export const WHATSAPP_DEFAULT_MESSAGE = "Hi, I'd like to book a home sample collection.";
export const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || "care@example.com";
export const SITE_URL = process.env.SITE_URL || "http://localhost:3000";

// Booking link the team WhatsApps (by hand, once the report is ready) to customers
// who opted for a follow-up doctor consultation. Shown in the owner's order email.
export const CONSULT_BOOKING_URL =
  process.env.CONSULT_BOOKING_URL || "https://cal.id/eazyhealthcare/partnership-call?user=eazyhealthcare";

export const SERVICE_AREAS =["JP Nagar", "Jayanagar", "BTM Layout", "Banashankari", "Kanakpura Road"];

export const TRUST_MARKERS = [
  {
    image: "/images/trust-pay-after-collection.webp",
    alt: "A crossed-out payment card and cash icon, illustrating no advance payment.",
    label: "Pay After Collection",
  },
  {
    image: "/images/trust-nabl-fortis.webp",
    alt: "NABL accreditation mark alongside the Fortis Hospitals logo.",
    label: "Samples Tested at Fortis Hospitals",
  },
  {
    image: "/images/trust-reports-6-hours.webp",
    alt: "A phone showing a WhatsApp message: \"Your Lab Report is Ready\", with a report attached, next to a 6 hours icon.",
    label: "Reports Within 6 Hours",
  },
  {
    image: "/images/trust-doctors-pan-india.webp",
    alt: "A map of India with a \"10,000+ Doctors PAN India\" callout.",
    label: "Trusted by 10,000+ Doctors PAN India",
  },
];

// Sourced from the business's own Google Business Profile (4.8 stars, 26
// reviews as of the last check). Names and quotes are copied verbatim from
// real, public Google reviews - nothing here is fabricated. No profile
// photos are hotlinked from Google (fragile, and against Maps' reuse terms);
// initials-based avatars are used instead, matching how most of these
// reviewers already appear on Google (default avatars, not custom photos).
export const GMB_RATING = { value: 4.8, count: 26 };
export const GMB_PROFILE_URL = "https://share.google/VaiixSdonP2bUwDJs";

export const CUSTOMER_REVIEWS = [
  { name: "Shilpa Shree S", rating: 5, text: "Best and fast services are delivered. Highly recommended!" },
  { name: "Syed Shabir", rating: 5, text: "Good service and accurate reading. Pain less sample collection, am happy." },
  { name: "Mohammed Afroz Niergad", rating: 5, text: "Good Lab & Quick response! On time sample collection." },
  { name: "Last Bench Productions", rating: 5, text: "Have chosen home collection and this was a good service - the result was on time and very helpful." },
  { name: "KR Ramesh", rating: 5, text: "Very informative about the tests. The charges are economical, and the team is punctual on collection of samples. Very knowledgeable, polite, and patient." },
  { name: "Srikanth Kalyanadurgam", rating: 5, text: "Good and efficient services." },
];
