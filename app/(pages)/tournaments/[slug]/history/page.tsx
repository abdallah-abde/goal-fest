import prisma from "@/lib/db";

import TournamentsHistory from "@/components/lists/TournamentsHistory";

export default async function TournamentsHistoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const tournamentEdition = await prisma.tournamentEdition.findFirst({
    where: { slug },
    select: { tournament: true },
  });

  const tournament = tournamentEdition?.tournament;

  const editions = await prisma.tournamentEdition.findMany({
    where: {
      tournament: {
        id: tournament?.id,
      },
      currentStage: "Finished",
    },
    include: {
      tournament: true,
      winner: true,
      titleHolder: true,
      hostingCountries: true,
    },
  });

  // const [tournamentEdition, matches] = await Promise.all([
  //   prisma.tournamentEdition.findUnique({
  //     where: { slug },
  //     select: { league: true },
  //   }),
  //   prisma.knockoutMatch.findMany({
  //     where: {
  //       round: "Final",
  //       tournamentEdition: {
  //         tournamentId: +params.id,
  //         currentStage: "Finished",
  //       },
  //     },
  //     include: {
  //       homeTeam: true,
  //       awayTeam: true,
  //       tournamentEdition: {
  //         include: {
  //           hostingCountries: true,
  //           winner: true,
  //           tournament: true,
  //         },
  //       },
  //     },
  //     orderBy: {
  //       tournamentEdition: {
  //         year: "desc",
  //       },
  //     },
  //   }),
  // ]);

  if (!tournament || !tournamentEdition)
    throw new Error("Something went wrong");

  return <TournamentsHistory tournament={tournament} editions={editions} />;
}
