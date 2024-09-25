import prisma from "@/lib/db";

export async function getAllMatchesRounds(tournamentEditionId: number) {
  // Fetch distinct rounds from Match (Group Stage)
  const groupStageRounds = await prisma.match.findMany({
    where: {
      tournamentEditionId: tournamentEditionId,
    },
    select: {
      round: true,
    },
    distinct: ["round"], // Get distinct rounds
  });

  // Fetch distinct rounds from KnockoutMatch (Knockout Stage)
  const knockoutRounds = await prisma.knockoutMatch.findMany({
    where: {
      tournamentEditionId: tournamentEditionId,
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
