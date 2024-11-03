import prisma from "@/lib/db";

import InfoCards from "@/components/lists/cards/edition-info-cards/InfoCards";

import {
  getTeamsGoalsAgainst,
  getTeamsGoalsScored,
  getTeamsCleanSheets,
} from "@/lib/data/queries";

export default async function TournamentsInfoPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const [edition, teamsGoalsScored, teamsGoalsAgainst, teamsCleanSheets] =
    await Promise.all([
      prisma.tournamentEdition.findUnique({
        where: {
          slug,
        },
        include: {
          tournament: true,
          teams: true,
          groups: true,
          winner: true,
          titleHolder: true,
          hostingCountries: true,
          matches: {
            include: {
              group: true,
              homeTeam: true,
              awayTeam: true,
              tournamentEdition: true,
            },
          },
          knockoutMatches: {
            include: {
              awayTeam: true,
              homeTeam: true,
              tournamentEdition: true,
            },
          },
        },
      }),
      getTeamsGoalsScored(slug, 5, "tournaments"),
      getTeamsGoalsAgainst(slug, 5, "tournaments"),
      getTeamsCleanSheets(slug, 5, "tournaments"),
    ]);

  if (!edition) throw new Error("Something went wrong");

  return (
    <InfoCards
      type="tournaments"
      editionOrSeason={edition}
      teamsGoalsScored={teamsGoalsScored}
      teamsGoalsAgainst={teamsGoalsAgainst}
      teamsCleanSheets={teamsCleanSheets}
    />
  );
}
