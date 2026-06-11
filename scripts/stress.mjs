import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../src/lib/worldcup.ts", import.meta.url), "utf8");
const countryCodes = [...source.matchAll(/code:\s*"([^"]+)"/g)].map((match) => match[1]);
const groupCodes = [...source.matchAll(/group:\s*"([^"]+)"/g)].map((match) => match[1]);
const matchLabels = [...source.matchAll(/label:\s*"([^"]+)"/g)].map((match) => match[1]);

const maxParticipants = 24;
const countriesPerParticipant = 2;
const expectedCountries = maxParticipants * countriesPerParticipant;

function assert(condition, message, detail = {}) {
  if (!condition) {
    console.error(JSON.stringify({ ok: false, message, ...detail }, null, 2));
    process.exit(1);
  }
}

function shuffle(input) {
  const copy = [...input];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function drawParticipants() {
  const pool = shuffle(countryCodes);
  return Array.from({ length: maxParticipants }, (_, index) => ({
    email: `stress-${index + 1}@example.test`,
    countries: pool.slice(index * countriesPerParticipant, (index + 1) * countriesPerParticipant),
  }));
}

assert(countryCodes.length === expectedCountries, "World Cup country count must be 48.", {
  countryCount: countryCodes.length,
});
assert(new Set(countryCodes).size === expectedCountries, "Country codes must be unique.");

const groupCounts = groupCodes.reduce((counts, group) => {
  counts[group] = (counts[group] ?? 0) + 1;
  return counts;
}, {});
assert(Object.keys(groupCounts).length === 12, "There must be 12 groups.");
assert(
  Object.values(groupCounts).every((count) => count === 4),
  "Each group must contain 4 countries.",
  { groupCounts },
);
assert(matchLabels.includes("World Cup Final"), "Schedule must include the final match.");

for (let run = 0; run < 1000; run += 1) {
  const participants = drawParticipants();
  const assigned = participants.flatMap((participant) => participant.countries);

  assert(participants.length === maxParticipants, "Participant count must stay capped.");
  assert(
    participants.every((participant) => participant.countries.length === countriesPerParticipant),
    "Every participant must receive exactly two countries.",
  );
  assert(new Set(assigned).size === assigned.length, "Draw must not duplicate countries.", { run });
  assert(assigned.length === expectedCountries, "Draw must allocate all 48 countries.", { run });
}

console.log(
  JSON.stringify(
    {
      ok: true,
      runs: 1000,
      maxParticipants,
      countriesPerParticipant,
      countryCount: countryCodes.length,
      groups: Object.keys(groupCounts).length,
      scheduleIncludesFinal: true,
    },
    null,
    2,
  ),
);
