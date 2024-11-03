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
  { params }: { params: { date: string; country: string | undefined } }
) {
  const { startDate, endDate } = getStartAndEndDates(params.date);

  const [matches, knockoutMatches, leagueMatches, leagueKnockoutMatches] =
    await Promise.all([
      prisma.match.findMany({
        where: {
          date: { gte: startDate, lte: endDate },
          tournamentEdition: {
            tournament: {
              isPopular: true,
            },
          },
        },
        include: {
          tournamentEdition: {
            include: {
              tournament: true,
              hostingCountries: true,
              teams: true,
              titleHolder: true,
              winner: true,
              groups: true,
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
          tournamentEdition: {
            tournament: {
              isPopular: true,
            },
          },
        },
        include: {
          tournamentEdition: {
            include: {
              tournament: true,
              hostingCountries: true,
              teams: true,
              titleHolder: true,
              winner: true,
              groups: true,
            },
          },
          homeTeam: true,
          awayTeam: true,
        },
      }),
      prisma.leagueMatch.findMany({
        where: {
          date: { gte: startDate, lte: endDate },
          season: {
            league: {
              OR: [
                {
                  isPopular: true,
                },
                {
                  country: {
                    name: {
                      contains: params.country,
                    },
                  },
                },
              ],
            },
          },
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
          season: {
            league: {
              OR: [
                {
                  isPopular: true,
                },
                {
                  country: {
                    name: {
                      contains: params.country,
                    },
                  },
                },
              ],
            },
          },
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
    switchLeagueKnockoutMatchesToNeutralMatches(leagueKnockoutMatches)
  );

  return Response.json(allMatches);
}
