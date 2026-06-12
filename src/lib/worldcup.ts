export type TeamStatus = "alive" | "eliminated";
export type DrawBucket = "favorite" | "least_favorite";
export type MatchStatus = "scheduled" | "live" | "finished";

export type Country = {
  code: string;
  iso2: string;
  name: string;
  group: string;
  status: TeamStatus;
  drawBucket: DrawBucket;
  oddsRank: number;
};

export type Match = {
  date: string;
  stage: string;
  label: string;
  venue: string;
  status?: MatchStatus;
  homeScore?: number;
  awayScore?: number;
};

export type StandingRow = {
  code: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
};

export const MAX_PARTICIPANTS = 24;
export const COUNTRIES_PER_PARTICIPANT = 2;
export const ENTRY_FEE_IDR = 100000;

export function flagUrl(iso2: string) {
  return `https://flagcdn.com/${iso2}.svg`;
}

export const countries: Country[] = [
  { code: "MEX", iso2: "mx", name: "Mexico", group: "A", status: "alive", drawBucket: "favorite", oddsRank: 13 },
  { code: "RSA", iso2: "za", name: "South Africa", group: "A", status: "alive", drawBucket: "least_favorite", oddsRank: 41 },
  { code: "KOR", iso2: "kr", name: "Korea Republic", group: "A", status: "alive", drawBucket: "favorite", oddsRank: 23 },
  { code: "CZE", iso2: "cz", name: "Czechia", group: "A", status: "alive", drawBucket: "least_favorite", oddsRank: 31 },
  { code: "CAN", iso2: "ca", name: "Canada", group: "B", status: "alive", drawBucket: "least_favorite", oddsRank: 29 },
  { code: "BIH", iso2: "ba", name: "Bosnia and Herzegovina", group: "B", status: "alive", drawBucket: "least_favorite", oddsRank: 39 },
  { code: "QAT", iso2: "qa", name: "Qatar", group: "B", status: "alive", drawBucket: "least_favorite", oddsRank: 45 },
  { code: "SUI", iso2: "ch", name: "Switzerland", group: "B", status: "alive", drawBucket: "favorite", oddsRank: 15 },
  { code: "BRA", iso2: "br", name: "Brazil", group: "C", status: "alive", drawBucket: "favorite", oddsRank: 5 },
  { code: "MAR", iso2: "ma", name: "Morocco", group: "C", status: "alive", drawBucket: "favorite", oddsRank: 16 },
  { code: "HAI", iso2: "ht", name: "Haiti", group: "C", status: "alive", drawBucket: "least_favorite", oddsRank: 48 },
  { code: "SCO", iso2: "gb-sct", name: "Scotland", group: "C", status: "alive", drawBucket: "least_favorite", oddsRank: 30 },
  { code: "USA", iso2: "us", name: "United States", group: "D", status: "alive", drawBucket: "favorite", oddsRank: 12 },
  { code: "PAR", iso2: "py", name: "Paraguay", group: "D", status: "alive", drawBucket: "least_favorite", oddsRank: 34 },
  { code: "AUS", iso2: "au", name: "Australia", group: "D", status: "alive", drawBucket: "least_favorite", oddsRank: 32 },
  { code: "TUR", iso2: "tr", name: "Turkiye", group: "D", status: "alive", drawBucket: "favorite", oddsRank: 20 },
  { code: "GER", iso2: "de", name: "Germany", group: "E", status: "alive", drawBucket: "favorite", oddsRank: 7 },
  { code: "CUW", iso2: "cw", name: "Curacao", group: "E", status: "alive", drawBucket: "least_favorite", oddsRank: 47 },
  { code: "CIV", iso2: "ci", name: "Ivory Coast", group: "E", status: "alive", drawBucket: "favorite", oddsRank: 24 },
  { code: "ECU", iso2: "ec", name: "Ecuador", group: "E", status: "alive", drawBucket: "favorite", oddsRank: 19 },
  { code: "NED", iso2: "nl", name: "Netherlands", group: "F", status: "alive", drawBucket: "favorite", oddsRank: 8 },
  { code: "JPN", iso2: "jp", name: "Japan", group: "F", status: "alive", drawBucket: "favorite", oddsRank: 18 },
  { code: "SWE", iso2: "se", name: "Sweden", group: "F", status: "alive", drawBucket: "least_favorite", oddsRank: 28 },
  { code: "TUN", iso2: "tn", name: "Tunisia", group: "F", status: "alive", drawBucket: "least_favorite", oddsRank: 37 },
  { code: "BEL", iso2: "be", name: "Belgium", group: "G", status: "alive", drawBucket: "favorite", oddsRank: 9 },
  { code: "EGY", iso2: "eg", name: "Egypt", group: "G", status: "alive", drawBucket: "least_favorite", oddsRank: 26 },
  { code: "IRN", iso2: "ir", name: "Iran", group: "G", status: "alive", drawBucket: "least_favorite", oddsRank: 33 },
  { code: "NZL", iso2: "nz", name: "New Zealand", group: "G", status: "alive", drawBucket: "least_favorite", oddsRank: 46 },
  { code: "ESP", iso2: "es", name: "Spain", group: "H", status: "alive", drawBucket: "favorite", oddsRank: 1 },
  { code: "CPV", iso2: "cv", name: "Cape Verde", group: "H", status: "alive", drawBucket: "least_favorite", oddsRank: 44 },
  { code: "KSA", iso2: "sa", name: "Saudi Arabia", group: "H", status: "alive", drawBucket: "least_favorite", oddsRank: 38 },
  { code: "URU", iso2: "uy", name: "Uruguay", group: "H", status: "alive", drawBucket: "favorite", oddsRank: 11 },
  { code: "FRA", iso2: "fr", name: "France", group: "I", status: "alive", drawBucket: "favorite", oddsRank: 2 },
  { code: "SEN", iso2: "sn", name: "Senegal", group: "I", status: "alive", drawBucket: "favorite", oddsRank: 22 },
  { code: "IRQ", iso2: "iq", name: "Iraq", group: "I", status: "alive", drawBucket: "least_favorite", oddsRank: 42 },
  { code: "NOR", iso2: "no", name: "Norway", group: "I", status: "alive", drawBucket: "favorite", oddsRank: 10 },
  { code: "ARG", iso2: "ar", name: "Argentina", group: "J", status: "alive", drawBucket: "favorite", oddsRank: 6 },
  { code: "ALG", iso2: "dz", name: "Algeria", group: "J", status: "alive", drawBucket: "least_favorite", oddsRank: 25 },
  { code: "AUT", iso2: "at", name: "Austria", group: "J", status: "alive", drawBucket: "favorite", oddsRank: 21 },
  { code: "JOR", iso2: "jo", name: "Jordan", group: "J", status: "alive", drawBucket: "least_favorite", oddsRank: 43 },
  { code: "POR", iso2: "pt", name: "Portugal", group: "K", status: "alive", drawBucket: "favorite", oddsRank: 4 },
  { code: "COD", iso2: "cd", name: "DR Congo", group: "K", status: "alive", drawBucket: "least_favorite", oddsRank: 40 },
  { code: "UZB", iso2: "uz", name: "Uzbekistan", group: "K", status: "alive", drawBucket: "least_favorite", oddsRank: 35 },
  { code: "COL", iso2: "co", name: "Colombia", group: "K", status: "alive", drawBucket: "favorite", oddsRank: 14 },
  { code: "ENG", iso2: "gb-eng", name: "England", group: "L", status: "alive", drawBucket: "favorite", oddsRank: 3 },
  { code: "CRO", iso2: "hr", name: "Croatia", group: "L", status: "alive", drawBucket: "favorite", oddsRank: 17 },
  { code: "GHA", iso2: "gh", name: "Ghana", group: "L", status: "alive", drawBucket: "least_favorite", oddsRank: 27 },
  { code: "PAN", iso2: "pa", name: "Panama", group: "L", status: "alive", drawBucket: "least_favorite", oddsRank: 36 },
];

export const groupOrder = "ABCDEFGHIJKL".split("");

export const matches: Match[] = [
  { date: "Jun 11", stage: "Group", label: "Mexico vs South Africa", venue: "Mexico City Stadium", status: "finished", homeScore: 2, awayScore: 0 },
  { date: "Jun 11", stage: "Group", label: "Korea Republic vs Czechia", venue: "Estadio Guadalajara", status: "finished", homeScore: 2, awayScore: 1 },
  { date: "Jun 12", stage: "Group", label: "Canada vs Bosnia and Herzegovina", venue: "Toronto Stadium" },
  { date: "Jun 12", stage: "Group", label: "United States vs Paraguay", venue: "Los Angeles Stadium" },
  { date: "Jun 13", stage: "Group", label: "Qatar vs Switzerland", venue: "San Francisco Bay Area Stadium" },
  { date: "Jun 13", stage: "Group", label: "Brazil vs Morocco", venue: "New York New Jersey Stadium" },
  { date: "Jun 13", stage: "Group", label: "Haiti vs Scotland", venue: "Boston Stadium" },
  { date: "Jun 13", stage: "Group", label: "Australia vs Turkiye", venue: "BC Place" },
  { date: "Jun 14", stage: "Group", label: "Germany vs Curacao", venue: "Houston Stadium" },
  { date: "Jun 14", stage: "Group", label: "Netherlands vs Japan", venue: "Dallas Stadium" },
  { date: "Jun 14", stage: "Group", label: "Ivory Coast vs Ecuador", venue: "Philadelphia Stadium" },
  { date: "Jun 14", stage: "Group", label: "Sweden vs Tunisia", venue: "Estadio Monterrey" },
  { date: "Jun 15", stage: "Group", label: "Spain vs Cape Verde", venue: "Atlanta Stadium" },
  { date: "Jun 15", stage: "Group", label: "Belgium vs Egypt", venue: "BC Place" },
  { date: "Jun 15", stage: "Group", label: "Saudi Arabia vs Uruguay", venue: "Miami Stadium" },
  { date: "Jun 15", stage: "Group", label: "Iran vs New Zealand", venue: "Los Angeles Stadium" },
  { date: "Jun 16", stage: "Group", label: "France vs Senegal", venue: "New York New Jersey Stadium" },
  { date: "Jun 16", stage: "Group", label: "Iraq vs Norway", venue: "Boston Stadium" },
  { date: "Jun 16", stage: "Group", label: "Argentina vs Algeria", venue: "Kansas City Stadium" },
  { date: "Jun 16", stage: "Group", label: "Austria vs Jordan", venue: "San Francisco Bay Area Stadium" },
  { date: "Jun 17", stage: "Group", label: "Portugal vs DR Congo", venue: "Houston Stadium" },
  { date: "Jun 17", stage: "Group", label: "England vs Croatia", venue: "Dallas Stadium" },
  { date: "Jun 17", stage: "Group", label: "Ghana vs Panama", venue: "Toronto Stadium" },
  { date: "Jun 17", stage: "Group", label: "Uzbekistan vs Colombia", venue: "Mexico City Stadium" },
  { date: "Jun 18", stage: "Group", label: "Czechia vs South Africa", venue: "Atlanta Stadium" },
  { date: "Jun 18", stage: "Group", label: "Switzerland vs Bosnia and Herzegovina", venue: "Los Angeles Stadium" },
  { date: "Jun 18", stage: "Group", label: "Canada vs Qatar", venue: "BC Place" },
  { date: "Jun 18", stage: "Group", label: "Mexico vs Korea Republic", venue: "Estadio Guadalajara" },
  { date: "Jun 19", stage: "Group", label: "Scotland vs Morocco", venue: "Boston Stadium" },
  { date: "Jun 19", stage: "Group", label: "United States vs Australia", venue: "Seattle Stadium" },
  { date: "Jun 19", stage: "Group", label: "Brazil vs Haiti", venue: "Philadelphia Stadium" },
  { date: "Jun 19", stage: "Group", label: "Turkiye vs Paraguay", venue: "San Francisco Bay Area Stadium" },
  { date: "Jun 20", stage: "Group", label: "Netherlands vs Sweden", venue: "Houston Stadium" },
  { date: "Jun 20", stage: "Group", label: "Germany vs Ivory Coast", venue: "Toronto Stadium" },
  { date: "Jun 20", stage: "Group", label: "Ecuador vs Curacao", venue: "Kansas City Stadium" },
  { date: "Jun 20", stage: "Group", label: "Tunisia vs Japan", venue: "Estadio Monterrey" },
  { date: "Jun 21", stage: "Group", label: "Spain vs Saudi Arabia", venue: "Atlanta Stadium" },
  { date: "Jun 21", stage: "Group", label: "Belgium vs Iran", venue: "Los Angeles Stadium" },
  { date: "Jun 21", stage: "Group", label: "Uruguay vs Cape Verde", venue: "Miami Stadium" },
  { date: "Jun 21", stage: "Group", label: "New Zealand vs Egypt", venue: "BC Place" },
  { date: "Jun 22", stage: "Group", label: "Argentina vs Austria", venue: "Dallas Stadium" },
  { date: "Jun 22", stage: "Group", label: "France vs Iraq", venue: "Philadelphia Stadium" },
  { date: "Jun 22", stage: "Group", label: "Norway vs Senegal", venue: "New York New Jersey Stadium" },
  { date: "Jun 22", stage: "Group", label: "Jordan vs Algeria", venue: "San Francisco Bay Area Stadium" },
  { date: "Jun 23", stage: "Group", label: "Portugal vs Uzbekistan", venue: "Houston Stadium" },
  { date: "Jun 23", stage: "Group", label: "England vs Ghana", venue: "Boston Stadium" },
  { date: "Jun 23", stage: "Group", label: "Panama vs Croatia", venue: "Toronto Stadium" },
  { date: "Jun 23", stage: "Group", label: "Colombia vs DR Congo", venue: "Estadio Guadalajara" },
  { date: "Jun 24", stage: "Group", label: "Switzerland vs Canada", venue: "BC Place" },
  { date: "Jun 24", stage: "Group", label: "Bosnia and Herzegovina vs Qatar", venue: "Seattle Stadium" },
  { date: "Jun 24", stage: "Group", label: "Scotland vs Brazil", venue: "Miami Stadium" },
  { date: "Jun 24", stage: "Group", label: "Morocco vs Haiti", venue: "Atlanta Stadium" },
  { date: "Jun 24", stage: "Group", label: "Czechia vs Mexico", venue: "Mexico City Stadium" },
  { date: "Jun 24", stage: "Group", label: "South Africa vs Korea Republic", venue: "Estadio Monterrey" },
  { date: "Jun 25", stage: "Group", label: "Ecuador vs Germany", venue: "New York New Jersey Stadium" },
  { date: "Jun 25", stage: "Group", label: "Curacao vs Ivory Coast", venue: "Philadelphia Stadium" },
  { date: "Jun 25", stage: "Group", label: "Japan vs Sweden", venue: "Dallas Stadium" },
  { date: "Jun 25", stage: "Group", label: "Tunisia vs Netherlands", venue: "Kansas City Stadium" },
  { date: "Jun 25", stage: "Group", label: "Turkiye vs United States", venue: "Los Angeles Stadium" },
  { date: "Jun 25", stage: "Group", label: "Paraguay vs Australia", venue: "San Francisco Bay Area Stadium" },
  { date: "Jun 26", stage: "Group", label: "Norway vs France", venue: "Boston Stadium" },
  { date: "Jun 26", stage: "Group", label: "Senegal vs Iraq", venue: "Toronto Stadium" },
  { date: "Jun 26", stage: "Group", label: "Cape Verde vs Saudi Arabia", venue: "Houston Stadium" },
  { date: "Jun 26", stage: "Group", label: "Uruguay vs Spain", venue: "Estadio Guadalajara" },
  { date: "Jun 26", stage: "Group", label: "Egypt vs Iran", venue: "Seattle Stadium" },
  { date: "Jun 26", stage: "Group", label: "New Zealand vs Belgium", venue: "BC Place" },
  { date: "Jun 27", stage: "Group", label: "Panama vs England", venue: "New York New Jersey Stadium" },
  { date: "Jun 27", stage: "Group", label: "Croatia vs Ghana", venue: "Philadelphia Stadium" },
  { date: "Jun 27", stage: "Group", label: "Colombia vs Portugal", venue: "Miami Stadium" },
  { date: "Jun 27", stage: "Group", label: "DR Congo vs Uzbekistan", venue: "Atlanta Stadium" },
  { date: "Jun 27", stage: "Group", label: "Algeria vs Austria", venue: "Kansas City Stadium" },
  { date: "Jun 27", stage: "Group", label: "Jordan vs Argentina", venue: "Dallas Stadium" },
  { date: "Jun 28 - Jul 3", stage: "Round of 32", label: "16 knockout matches", venue: "US, Canada, Mexico" },
  { date: "Jul 4 - Jul 7", stage: "Round of 16", label: "8 knockout matches", venue: "US, Canada, Mexico" },
  { date: "Jul 9 - Jul 11", stage: "Quarterfinals", label: "4 quarterfinal matches", venue: "Boston, Los Angeles, Miami, Kansas City" },
  { date: "Jul 14 - Jul 15", stage: "Semifinals", label: "2 semifinal matches", venue: "Dallas and Atlanta" },
  { date: "Jul 18", stage: "Third place", label: "Bronze medal match", venue: "Miami Stadium" },
  { date: "Jul 19", stage: "Final", label: "World Cup Final", venue: "New York New Jersey Stadium" },
];

export function groupedCountries() {
  return groupOrder.map((group) => ({
    group,
    countries: countries.filter((country) => country.group === group),
  }));
}

export function countryByCode(code: string) {
  return countries.find((country) => country.code === code);
}

export function drawBuckets() {
  return {
    favorite: countries
      .filter((country) => country.drawBucket === "favorite")
      .sort((a, b) => a.oddsRank - b.oddsRank),
    leastFavorite: countries
      .filter((country) => country.drawBucket === "least_favorite")
      .sort((a, b) => a.oddsRank - b.oddsRank),
  };
}

export function splitMatchLabel(label: string) {
  const [home, away] = label.split(" vs ");
  return { home: home ?? label, away: away ?? "TBD" };
}

export function countryByName(name: string) {
  return countries.find((country) => country.name === name);
}

export function matchTeams(match: Pick<Match, "label" | "stage">) {
  if (match.stage !== "Group") return null;
  const { home, away } = splitMatchLabel(match.label);
  const homeCountry = countryByName(home);
  const awayCountry = countryByName(away);
  if (!homeCountry || !awayCountry) return null;
  return { home: homeCountry, away: awayCountry };
}

export function calculateGroupStandings(inputMatches: Match[] = matches) {
  const rows = Object.fromEntries(
    countries.map((country) => [
      country.code,
      { code: country.code, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 } satisfies StandingRow,
    ]),
  );

  for (const match of inputMatches) {
    if (match.stage !== "Group" || match.status !== "finished" || typeof match.homeScore !== "number" || typeof match.awayScore !== "number") continue;
    const teams = matchTeams(match);
    if (!teams) continue;
    const home = rows[teams.home.code];
    const away = rows[teams.away.code];
    home.played += 1; away.played += 1;
    home.goalsFor += match.homeScore; home.goalsAgainst += match.awayScore;
    away.goalsFor += match.awayScore; away.goalsAgainst += match.homeScore;
    if (match.homeScore > match.awayScore) { home.won += 1; home.points += 3; away.lost += 1; }
    else if (match.homeScore < match.awayScore) { away.won += 1; away.points += 3; home.lost += 1; }
    else { home.drawn += 1; away.drawn += 1; home.points += 1; away.points += 1; }
    home.goalDifference = home.goalsFor - home.goalsAgainst;
    away.goalDifference = away.goalsFor - away.goalsAgainst;
  }

  return Object.fromEntries(
    groupOrder.map((group) => [
      group,
      countries.filter((c) => c.group === group).map((c) => rows[c.code]).sort(
        (a, b) => b.points - a.points || b.goalDifference - a.goalDifference || b.goalsFor - a.goalsFor || a.code.localeCompare(b.code),
      ),
    ]),
  ) as Record<string, StandingRow[]>;
}
