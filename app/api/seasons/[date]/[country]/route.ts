import prisma from "@/lib/db";

import { getStartAndEndDates } from "@/lib/getFormattedDate";

export async function GET(
  request: Request,
  { params }: { params: { date: string; country: string } }
) {
  const { startDate, endDate } = getStartAndEndDates(params.date);

  const [editions, seasons] = await Promise.all([
    prisma.tournamentEdition.findMany({
      where: {
        AND: [
          {
            OR: [
              {
                tournament: {
                  isPopular: true,
                },
              },
              {
                hostingCountries: {
                  some: {
                    name: {
                      contains: params.country,
                    },
                  },
                },
              },
            ],
          },
          {
            OR: [
              {
                matches: {
                  some: {
                    date: { gte: startDate, lte: endDate },
                  },
                },
              },
              {
                knockoutMatches: {
                  some: {
                    date: { gte: startDate, lte: endDate },
                  },
                },
              },
            ],
          },
        ],
      },
      select: {
        tournament: {
          select: {
            name: true,
            logoUrl: true,
          },
        },
        id: true,
        year: true,
        slug: true,
        logoUrl: true,
      },
    }),
    prisma.leagueSeason.findMany({
      where: {
        AND: [
          {
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
          {
            OR: [
              {
                matches: {
                  some: {
                    date: { gte: startDate, lte: endDate },
                  },
                },
              },
              {
                knockoutMatches: {
                  some: {
                    date: { gte: startDate, lte: endDate },
                  },
                },
              },
            ],
          },
        ],
      },
      select: {
        league: {
          select: {
            name: true,
            logoUrl: true,
          },
        },
        id: true,
        year: true,
        slug: true,
        logoUrl: true,
      },
    }),
  ]);

  const alteredEditions = editions.map((edition) => {
    return {
      id: edition.id,
      year: edition.year,
      logoUrl: edition.logoUrl,
      slug: edition.slug,
      type: "tournaments",
      tournamentOrLeagueName: edition.tournament.name,
      tournamentOrLeagueLogoUrl: edition.tournament.logoUrl,
    };
  });

  const alteredSeasons = seasons.map((season) => {
    return {
      id: season.id,
      year: season.year,
      logoUrl: season.logoUrl,
      slug: season.slug,
      type: "leagues",
      tournamentOrLeagueName: season.league.name,
      tournamentOrLeagueLogoUrl: season.league.logoUrl,
    };
  });

  return Response.json(alteredEditions.concat(alteredSeasons));
}
