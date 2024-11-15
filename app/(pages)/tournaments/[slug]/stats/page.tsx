import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";

import { TotalCleanSheetsProps, TotalGoalsProps } from "@/types/totalStats";

import PageHeader from "@/components/PageHeader";
import TeamsStats from "@/components/lists/cards/stats/TeamsStats";

import {
  getTeamsCleanSheets,
  getTeamsGoalsAgainst,
  getTeamsGoalsScored,
} from "@/lib/data/queries";

export default async function TournamentsStatsPage({
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
    getTeamsGoalsScored(slug, undefined, "tournaments"),
    getTeamsGoalsAgainst(slug, undefined, "tournaments"),
    getTeamsCleanSheets(slug, undefined, "tournaments"),
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
