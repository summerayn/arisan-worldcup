const baseUrl = process.env.VERIFY_BASE_URL ?? "https://arisan-worldcup.vercel.app";
const requirePublicReady = process.env.REQUIRE_PUBLIC_READY !== "false";

async function getJson(path) {
  const response = await fetch(`${baseUrl}${path}`, { cache: "no-store" });
  const payload = await response.json().catch(() => ({}));
  return { response, payload };
}

function fail(message, detail = {}) {
  console.error(JSON.stringify({ ok: false, message, ...detail }, null, 2));
  process.exit(1);
}

const readiness = await getJson("/api/readiness");
if (!readiness.response.ok) {
  fail("Readiness endpoint failed.", { status: readiness.response.status, payload: readiness.payload });
}

const state = await getJson("/api/state");
if (!state.response.ok) {
  fail("State endpoint failed.", { status: state.response.status, payload: state.payload });
}

const participants = state.payload.participants ?? [];
const countries = participants.flatMap((participant) => participant.countries ?? []);
const duplicateEmails = participants
  .map((participant) => participant.email)
  .filter((email, index, emails) => emails.indexOf(email) !== index);
const duplicateCountries = countries.filter((country, index) => countries.indexOf(country) !== index);

if (participants.length > 24) {
  fail("Participant count exceeds 24.", { participants: participants.length });
}

if (countries.length !== participants.length * 2) {
  fail("Each participant must have exactly two countries.", {
    participants: participants.length,
    assignedCountries: countries.length,
  });
}

if (duplicateEmails.length || duplicateCountries.length) {
  fail("Duplicate assignment detected.", { duplicateEmails, duplicateCountries });
}

if (requirePublicReady && !readiness.payload.ready) {
  fail("Production is not public-ready yet.", {
    readiness: readiness.payload,
    hint: "Set Supabase, DOKU, ADMIN_TOKEN, and NEXT_PUBLIC_APP_URL env vars, run schema.sql, then redeploy.",
  });
}

console.log(
  JSON.stringify(
    {
      ok: true,
      baseUrl,
      readiness: readiness.payload,
      participants: participants.length,
      assignedCountries: countries.length,
    },
    null,
    2,
  ),
);
