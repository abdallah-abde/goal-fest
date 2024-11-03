import prisma from "@/lib/db";

import MatchesCards from "@/components/lists/cards/matches/MatchesCards";
import {
  getAllLeagueMatchesRounds,
  checkLeagueRoundExisted,
} from "@/lib/getAllMatchesRounds";
import { getStartAndEndDates } from "@/lib/getFormattedDate";

export default async function LeagueMatchesPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: {
    teamId: string;
    groupId: string;
    round: string | undefined;
    date: string;
  };
}) {
  const { slug } = params;

  const teamId = searchParams?.teamId || "all";
  const groupId = searchParams?.groupId || "all";
  let round = searchParams?.round || undefined;
  const date = searchParams?.date || "";

  round = await checkLeagueRoundExisted(slug, searchParams?.round);

  const isAllTeams = !teamId || teamId === "all";
  const isAllGroups = !groupId || groupId === "all";

  const { startDate, endDate } = getStartAndEndDates(date);

  const groupMatchConditions: any = {
    ...(groupId && !isAllGroups && { groupId: +groupId }), // Filter by group if specific group selected
    ...(round && { round }), // Filter by round if provided
    ...(date && { date: { gte: startDate, lte: endDate } }),
  };

  if (!isAllTeams) {
    groupMatchConditions.OR = [
      { homeTeamId: +teamId },
      { awayTeamId: +teamId },
    ];
  }

  const knockoutMatchConditions: any = {
    ...(round && { round }), // Filter by round if provided
    ...(date && { date: { gte: startDate, lte: endDate } }),
  };

  if (!isAllTeams) {
    knockoutMatchConditions.OR = [
      { homeTeamId: +teamId },
      { awayTeamId: +teamId },
    ];
  }

  const [leagueSeason, matches, knockoutMatches, rounds] = await Promise.all([
    prisma.leagueSeason.findUnique({
      where: { slug },
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
      },
    }),
    isAllGroups || groupId
      ? prisma.leagueMatch.findMany({
          where: {
            season: {
              slug,
            },
            ...groupMatchConditions,
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
                groups: true,
              },
            },
            group: true,
          },
        })
      : [],
    isAllGroups
      ? prisma.leagueKnockoutMatch.findMany({
          where: {
            season: {
              slug,
            },
            ...knockoutMatchConditions,
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
                groups: true,
              },
            },
          },
        })
      : [],
    getAllLeagueMatchesRounds(slug),
  ]);

  if (!leagueSeason) throw new Error("Something went wrong");

  return (
    <MatchesCards
      editionOrseason={leagueSeason}
      matches={matches}
      knockoutMatches={knockoutMatches}
      rounds={rounds}
      type="leagues"
    />
  );
}
