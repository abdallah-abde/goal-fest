import prisma from "@/lib/db";

import {
  switchTournamentMatchesToNeutralMatches,
  switchTournamentKnockoutMatchesToNeutralMatches,
  switchLeagueMatchesToNeutralMatches,
  switchLeagueKnockoutMatchesToNeutralMatches,
} from "@/lib/data/switchers";

import { getStartAndEndDates } from "@/lib/getFormattedDate";

export async function GET(
  request: Request,
  { params }: { params: { date: string } }
) {
  const { startDate, endDate } = getStartAndEndDates(params.date);

  const [matches, knockoutMatches, leagueMatches, LeagueKnockoutMatches] =
    await Promise.all([
      prisma.match.findMany({
        where: {
          date: { gte: startDate, lte: endDate },
        },
        include: {
          tournamentEdition: {
            include: {
              tournament: true,
              hostingCountries: true,
              teams: true,
              winner: true,
              groups: true,
              titleHolder: true,
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
              teams: true,
              winner: true,
              groups: true,
              titleHolder: true,
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
          group: true,
          season: {
            include: {
              league: { include: { country: true } },
              teams: true,
              winner: true,
              titleHolder: true,
              groups: true,
            },
          },
        },
      }),
      prisma.leagueKnockoutMatch.findMany({
        where: {
          date: { gte: startDate, lte: endDate },
        },
        include: {
          homeTeam: true,
          awayTeam: true,
          season: {
            include: {
              league: { include: { country: true } },
              teams: true,
              winner: true,
              titleHolder: true,
              groups: true,
            },
          },
        },
      }),
    ]);

  const allMatches = switchTournamentMatchesToNeutralMatches(matches).concat(
    switchTournamentKnockoutMatchesToNeutralMatches(knockoutMatches),
    switchLeagueMatchesToNeutralMatches(leagueMatches),
    switchLeagueKnockoutMatchesToNeutralMatches(LeagueKnockoutMatches)
  );

  return Response.json(allMatches);
}
