import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";

import { TotalCleanSheetsProps, TotalGoalsProps } from "@/types/totalStats";

import InfoCards from "@/components/lists/cards/edition-info-cards/InfoCards";

import {
  getTeamsGoalsAgainst,
  getTeamsGoalsScored,
  getTeamsCleanSheets,
} from "@/lib/data/queries";

export default async function LeaguesInfoPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const [leagueSeason, teamsGoalsScored, teamsGoalsAgainst, teamsCleanSheets] =
    await Promise.all([
      prisma.leagueSeason.findFirst({
        where: {
          slug,
        },
        include: {
          league: {
            include: {
              country: true,
            },
          },
          teams: true,
          groups: true,
          winner: true,
          titleHolder: true,
          matches: {
            include: {
              group: true,
              homeTeam: true,
              awayTeam: true,
              season: true,
            },
          },
          knockoutMatches: {
            include: {
              homeTeam: true,
              awayTeam: true,
              season: true,
            },
          },
        },
      }),
      await getTeamsGoalsScored(slug, 5, "leagues"),
      await getTeamsGoalsAgainst(slug, 5, "leagues"),
      await getTeamsCleanSheets(slug, 5, "leagues"),
    ]);

  if (!leagueSeason) throw new Error("Something went wrong");

  return (
    <InfoCards
      editionOrSeason={leagueSeason}
      teamsGoalsScored={teamsGoalsScored}
      teamsGoalsAgainst={teamsGoalsAgainst}
      teamsCleanSheets={teamsCleanSheets}
      type="leagues"
    />
  );
}
