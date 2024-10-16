import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";

import {
  TournamentTotalCleanSheetsProps,
  TournamentTotalGoalsProps,
} from "@/types/totalStats";

import PageHeader from "@/components/PageHeader";
import TeamsStats from "@/components/lists/cards/stats/TeamsStats";

import {
  getTournamentTeamsCleanSheets,
  getTournamentTeamsGoalsAgainst,
  getTournamentTeamsGoalsScored,
} from "@/lib/data/queries";

export default async function StatsPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const [
    tournamentEdition,
    teamsGoalsScored,
    teamsGoalsAgainst,
    teamsCleanSheets,
  ] = await Promise.all([
    prisma.tournamentEdition.findUnique({
      where: {
        slug,
      },
      include: {
        teams: true,
        tournament: true,
        winner: true,
        titleHolder: true,
        hostingCountries: true,
      },
    }),
    await prisma.$queryRaw<TournamentTotalGoalsProps[]>`${Prisma.raw(
      getTournamentTeamsGoalsScored(slug)
    )}`,
    await prisma.$queryRaw<TournamentTotalGoalsProps[]>`${Prisma.raw(
      getTournamentTeamsGoalsAgainst(slug)
    )}`,
    await prisma.$queryRaw<TournamentTotalCleanSheetsProps[]>`${Prisma.raw(
      getTournamentTeamsCleanSheets(slug)
    )}`,
  ]);

  if (!tournamentEdition) throw new Error("Something went wrong");

  return (
    <>
      <PageHeader
        label={`${tournamentEdition.tournament.name} ${tournamentEdition.year} Statistics`}
      />

      <TeamsStats
        teamsGoalsScored={teamsGoalsScored}
        teamsGoalsAgainst={teamsGoalsAgainst}
        teamsCleanSheets={teamsCleanSheets}
      />
    </>
  );
}
