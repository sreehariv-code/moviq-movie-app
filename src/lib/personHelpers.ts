import type { CombinedCredit } from "@/types/tmdb";

interface FilmographyCredit extends CombinedCredit {
  creditType: "cast" | "crew";
  role: string | undefined;
}

interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

// Calculate age from birthday (handle deathday if deceased)
export function calculateAge(birthday: string | null | undefined, deathday: string | null = null): number | null {
  if (!birthday) return null;
  const birthDate = new Date(birthday);
  const endDate = deathday ? new Date(deathday) : new Date();
  let age = endDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = endDate.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && endDate.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
}

// Get top 10 "Known For" credits based on department
export function getKnownForCredits(
  combinedCredits: { cast?: CombinedCredit[]; crew?: CombinedCredit[] } | null | undefined,
  knownForDept: string | undefined
): CombinedCredit[] {
  if (!combinedCredits) return [];

  let filtered: CombinedCredit[];
  if (knownForDept === "Acting") {
    filtered = combinedCredits.cast || [];
  } else if (knownForDept === "Directing") {
    filtered = (combinedCredits.crew || []).filter((c) => c.job === "Director");
  } else {
    filtered = [
      ...(combinedCredits.cast || []),
      ...(combinedCredits.crew || []),
    ];
  }

  return filtered
    .filter((c) => c.poster_path) // Only items with posters
    .sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))
    .slice(0, 10);
}

// Process and deduplicate filmography
export function processFilmography(
  cast: CombinedCredit[] | undefined,
  crew: CombinedCredit[] | undefined
): FilmographyCredit[] {
  const allCredits: FilmographyCredit[] = [
    ...(cast || []).map((c) => ({ ...c, creditType: "cast" as const, role: c.character })),
    ...(crew || []).map((c) => ({ ...c, creditType: "crew" as const, role: c.job })),
  ];

  // Deduplicate by id + media_type
  const unique = allCredits.filter(
    (item, index, self) =>
      index ===
      self.findIndex((t) => t.id === item.id && t.media_type === item.media_type)
  );

  // Sort by date (newest first)
  unique.sort((a, b) => {
    const dateA = a.release_date || a.first_air_date || "1900";
    const dateB = b.release_date || b.first_air_date || "1900";
    return dateB.localeCompare(dateA);
  });

  return unique;
}

// Build social link objects
export function getSocialLinks(externalIds: Record<string, string | null> | null | undefined): SocialLink[] {
  if (!externalIds) return [];

  const links: SocialLink[] = [];
  if (externalIds.imdb_id) {
    links.push({
      name: "IMDb",
      url: `https://www.imdb.com/name/${externalIds.imdb_id}`,
      icon: "ExternalLink",
    });
  }
  if (externalIds.instagram_id) {
    links.push({
      name: "Instagram",
      url: `https://www.instagram.com/${externalIds.instagram_id}`,
      icon: "Instagram",
    });
  }
  if (externalIds.twitter_id) {
    links.push({
      name: "Twitter",
      url: `https://twitter.com/${externalIds.twitter_id}`,
      icon: "Twitter",
    });
  }
  return links;
}

// Format birthday for display
export function formatBirthday(birthday: string | null | undefined, deathday: string | null = null): string | null {
  if (!birthday) return null;

  const date = new Date(birthday);
  const formatted = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const age = calculateAge(birthday, deathday);
  if (!age) return formatted;

  if (deathday) {
    return `${formatted} (Died at age ${age})`;
  }

  return `${formatted} (Age ${age})`;
}

// Group credits by decade
export function groupByDecade(credits: FilmographyCredit[]): Record<string, FilmographyCredit[]> {
  const grouped: Record<string, FilmographyCredit[]> = {};

  credits.forEach((credit) => {
    const date = credit.release_date || credit.first_air_date;
    if (!date) {
      if (!grouped["Unknown"]) grouped["Unknown"] = [];
      grouped["Unknown"].push(credit);
      return;
    }
    const year = parseInt(date.split("-")[0]);
    const decade = `${Math.floor(year / 10) * 10}s`;
    if (!grouped[decade]) grouped[decade] = [];
    grouped[decade].push(credit);
  });

  // Sort decades descending
  return Object.keys(grouped)
    .sort((a, b) => b.localeCompare(a))
    .reduce((acc, key) => ({ ...acc, [key]: grouped[key] }), {} as Record<string, FilmographyCredit[]>);
}
