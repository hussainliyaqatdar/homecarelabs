import { NextResponse } from "next/server";

// Tiny, dependency-free endpoint for uptime pingers - the homepage's full
// SSR'd HTML is too large for cron-job.org's response-size limit and got the
// keep-alive job auto-disabled ("Response data too big").
export async function GET() {
  return NextResponse.json({ status: "ok" });
}
