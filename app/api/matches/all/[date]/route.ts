import prisma from "@/lib/db";

import {
  switchGroupMatchesToNeutralMatches,
  switchKnockoutMatchesToNeutralMatches,
  switchLeagueMatchesToNeutralMatches,
} from "@/lib/data/switchers";

import { getStartAndEndDates } from "@/lib/getFormattedDate";

export async function GET(
  request: Request,
  { params }: { params: { date: string } }
) {
  const { startDate, endDate } = getStartAndEndDates(params.date);

  const [matches, knockoutMatches, leagueMatches] = await Promise.all([
    prisma.match.findMany({
      where: {
        date: { gte: startDate, lte: endDate },
      },
      include: {
        tournamentEdition: {
          include: {
            tournament: true,
            hostingCountries: true,
          },
        },
        homeTeam: true,
        awayTeam: true,
        group: true,
      },
    }),
    prisma.knockoutMatch.findMany({
      where: {
        date: { gte: startDate, lte: endDate },
      },
      include: {
        tournamentEdition: {
          include: {
            tournament: true,
            hostingCountries: true,
          },
        },
        homeTeam: true,
        awayTeam: true,
      },
    }),
    prisma.leagueMatch.findMany({
      where: {
        date: { gte: startDate, lte: endDate },
      },
      include: {
        homeTeam: true,
        awayTeam: true,
        season: { include: { league: { include: { country: true } } } },
      },
    }),
  ]);

  const allMatches = switchGroupMatchesToNeutralMatches(matches).concat(
    switchKnockoutMatchesToNeutralMatches(knockoutMatches),
    switchLeagueMatchesToNeutralMatches(leagueMatches)
  );

  return Response.json(allMatches);
}
