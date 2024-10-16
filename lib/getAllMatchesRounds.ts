import prisma from "@/lib/db";

export async function getAllTournamentMatchesRounds(slug: string) {
  // Fetch distinct rounds from Match (Group Stage)
  const groupStageRounds = await prisma.match.findMany({
    where: {
      tournamentEdition: {
        slug,
      },
    },
    select: {
      round: true,
    },
    distinct: ["round"], // Get distinct rounds
  });

  // Fetch distinct rounds from KnockoutMatch (Knockout Stage)
  const knockoutRounds = await prisma.knockoutMatch.findMany({
    where: {
      tournamentEdition: {
        slug,
      },
    },
    select: {
      round: true,
    },
    distinct: ["round"], // Get distinct rounds
  });

  // Combine the two sets of rounds into one array and remove duplicates
  const allRounds = [
    ...groupStageRounds.map((match) => match.round),
    ...knockoutRounds.map((match) => match.round),
  ];

  // Remove duplicates by converting to a Set and back to an array
  const distinctRounds = Array.from(new Set(allRounds)).filter(
    (a) => a !== null
  );

  return distinctRounds;
}

export async function getAllLeagueMatchesRounds(slug: string) {
  // Fetch distinct rounds from League Match
  const rounds = await prisma.leagueMatch.findMany({
    where: {
      season: {
        slug,
      },
    },
    select: {
      round: true,
    },
    distinct: ["round"], // Get distinct rounds
  });

  // Combine the two sets of rounds into one array and remove duplicates
  const allRounds = [...rounds.map((match) => match.round)];

  // Remove duplicates by converting to a Set and back to an array
  const distinctRounds = Array.from(new Set(allRounds)).filter(
    (a) => a !== null
  );

  return distinctRounds;
}

export async function checkTournamentRoundExisted(
  slug: string,
  round?: string | undefined
) {
  if (round === undefined) return undefined;

  const rounds = await getAllTournamentMatchesRounds(slug);

  return rounds.find((a) => a === round);
}

export async function checkLeagueRoundExisted(
  slug: string,
  round?: string | undefined
) {
  if (round === undefined) return undefined;

  const rounds = await getAllLeagueMatchesRounds(slug);

  return rounds.find((a) => a === round);
}
