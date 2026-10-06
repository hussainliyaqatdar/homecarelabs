// Pricing and wording for the two follow-up-consultation offers being tested on
// /compare/consult-addon and /compare/consult-included. Pure and dependency-light
// so the exact same functions run in the browser (cart, comparison pages) and on
// the server (the authoritative price when a booking is placed).
import type { CartLineOffer } from "./types";
import { COMPARE_PACKAGE_SLUGS } from "./checkup-compare";
import { getConsultDoctor } from "./consult-doctors";

// What the follow-up consultation costs as an add-on (variant "addon").
export const CONSULT_FEE = 500;

// Packages whose bundled-consultation price is set by hand instead of by the
// rule in bundledPrice().
const BUNDLED_PRICE_OVERRIDES: Record<string, number> = {
  "full-body-checkup-pro": 3499,
};

// Price of a package with the consultation included: the top of the Rs. 1,000
// band its normal price sits in, so it ends in 999 (e.g. 1350 -> 1999,
// 3099 -> 3999). That is always at least the normal price, and what pays for
// the bundled consultation.
export function bundledPrice(slug: string, basePrice: number): number {
  return BUNDLED_PRICE_OVERRIDES[slug] ?? Math.floor(basePrice / 1000) * 1000 + 999;
}

// Offers can only be attached to the packages shown on the comparison pages.
export function isOfferEligible(kind: "test" | "package", slug: string): boolean {
  return kind === "package" && COMPARE_PACKAGE_SLUGS.includes(slug);
}

// Whether the customer is getting a consultation with this line.
export function hasConsult(offer: CartLineOffer | undefined): boolean {
  return !!offer && (offer.variant === "included" || offer.consult === true);
}

// Add-on: the package's own price (+ the consultation fee when `withConsult`).
// Included: the bundledPrice() (always bundled, whatever `withConsult` is).
type PricedPackage = { slug: string; price: number; mrp: number | null };
export function quoteOffer(base: PricedPackage, variant: CartLineOffer["variant"], withConsult: boolean) {
  const mrp = base.mrp ?? base.price;
  if (variant === "included") return { price: bundledPrice(base.slug, base.price), mrp: mrp + CONSULT_FEE };
  if (withConsult) return { price: base.price + CONSULT_FEE, mrp: mrp + CONSULT_FEE };
  return { price: base.price, mrp };
}

// Price of a cart/order line.
export function priceWithOffer(base: PricedPackage, offer: CartLineOffer | undefined) {
  if (!offer) return { price: base.price, mrp: base.mrp ?? base.price };
  return quoteOffer(base, offer.variant, hasConsult(offer));
}

// One-line description of the consultation on a cart/order line; null if none.
// The doctor is only known once chosen at checkout.
export function describeConsult(offer: (CartLineOffer & { doctorName?: string }) | undefined): string | null {
  if (!offer || !hasConsult(offer)) return null;
  const doctor = offer.doctorName ?? getConsultDoctor(offer.doctorId)?.name;
  if (offer.variant === "included") {
    return doctor ? `Includes follow-up consultation with ${doctor}` : "Includes a follow-up doctor consultation";
  }
  return doctor ? `Follow-up consultation with ${doctor} (+Rs. ${CONSULT_FEE})` : `Follow-up doctor consultation (+Rs. ${CONSULT_FEE})`;
}
