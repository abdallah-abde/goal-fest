import prisma from "@/lib/db";

import LeagueMatchesCards from "@/components/lists/cards/matches/LeagueMatchesCards";
import {
  getAllLeagueMatchesRounds,
  checkLeagueRoundExisted,
} from "@/lib/getAllMatchesRounds";
import { getStartAndEndDates } from "@/lib/getFormattedDate";

export default async function LeaguesMatchesPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: {
    teamId: string;
    round: string | undefined;
    date: string;
  };
}) {
  const { slug } = params;

  const teamId = searchParams?.teamId || "all";
  let round = searchParams?.round || undefined;
  const date = searchParams?.date || "";

  round = await checkLeagueRoundExisted(slug, searchParams?.round);

  const isAllTeams = !teamId || teamId === "all";

  const { startDate, endDate } = getStartAndEndDates(date);

  const matchConditions: any = {
    ...(round && { round }), // Filter by round if provided
    ...(date && { date: { gte: startDate, lte: endDate } }),
  };

  if (!isAllTeams) {
    matchConditions.OR = [{ homeTeamId: +teamId }, { awayTeamId: +teamId }];
  }

  const [leagueSeason, matches, rounds] = await Promise.all([
    prisma.leagueSeason.findUnique({
      where: { slug },
      include: {
        league: {
          include: {
            country: true,
          },
        },
        teams: true,
        winner: true,
        titleHolder: true,
      },
    }),
    prisma.leagueMatch.findMany({
      where: {
        season: {
          slug,
        },
        ...matchConditions,
      },
      include: {
        homeTeam: true,
        awayTeam: true,
        season: {
          include: {
            league: {
              include: {
                country: true,
              },
            },
            teams: true,
            winner: true,
            titleHolder: true,
          },
        },
      },
    }),
    getAllLeagueMatchesRounds(slug),
  ]);

  if (!leagueSeason) throw new Error("Something went wrong");

  return (
    <LeagueMatchesCards
      leagueSeason={leagueSeason}
      matches={matches}
      rounds={rounds}
    />
  );
}
