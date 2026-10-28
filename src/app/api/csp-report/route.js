// Receives Content-Security-Policy violation reports (the policy in
// next.config.js is report-only) and writes a one-line summary to the function
// logs. It stores nothing and always answers 204, so it cannot be used to probe.
const MAX_BODY = 4000;
const pick = (value, max = 200) => (typeof value === "string" ? value.slice(0, max) : undefined);

export async function POST(request) {
  try {
    const text = (await request.text()).slice(0, MAX_BODY);
    const body = JSON.parse(text);
    const report = body["csp-report"] || body;
    console.warn("[csp-report]", JSON.stringify({
      directive: pick(report["violated-directive"] || report.effectiveDirective),
      blocked: pick(report["blocked-uri"] || report.blockedURL),
      page: pick(report["document-uri"] || report.documentURL),
      source: pick(report["source-file"] || report.sourceFile),
    }));
  } catch {
    // Malformed report: ignore.
  }
  return new Response(null, { status: 204 });
}
