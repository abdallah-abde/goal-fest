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

  const [season, teamsGoalsScored, teamsGoalsAgainst, teamsCleanSheets] =
    await Promise.all([
      prisma.season.findFirst({
        where: {
          slug,
        },
        include: {
          hostingCountries: true,
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
        },
      }),
      await getTeamsGoalsScored(slug, 5),
      await getTeamsGoalsAgainst(slug, 5),
      await getTeamsCleanSheets(slug, 5),
    ]);

  if (!season) throw new Error("Something went wrong");

  return (
    <InfoCards
      season={season}
      teamsGoalsScored={teamsGoalsScored}
      teamsGoalsAgainst={teamsGoalsAgainst}
      teamsCleanSheets={teamsCleanSheets}
      // type="leagues"
    />
  );
}
