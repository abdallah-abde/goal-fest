import prisma from "@/lib/db";

export async function getMatches(where: {}) {
  return await prisma.match.findMany({
    where: { ...where },
    select: {
      awayExtraTimeGoals: true,
      homeExtraTimeGoals: true,
      awayPenaltyGoals: true,
      homePenaltyGoals: true,
      awayGoals: true,
      homeGoals: true,
      awayTeamId: true,
      homeTeamId: true,
      awayTeam: {
        select: {
          flagUrl: true,
          name: true,
        },
      },
      homeTeam: {
        select: {
          flagUrl: true,
          name: true,
        },
      },
      date: true,
      groupId: true,
      group: {
        select: {
          name: true,
        },
      },
      round: true,
      id: true,
      isFeatured: true,
      status: true,
      seasonId: true,
      season: {
        select: {
          slug: true,
          hostingCountries: {
            select: {
              name: true,
              id: true,
              flagUrl: true,
            },
          },
          flagUrl: true,
          year: true,
          league: {
            select: {
              name: true,
              flagUrl: true,
              country: {
                select: {
                  name: true,
                  id: true,
                  flagUrl: true,
                },
              },
            },
          },
        },
      },
    },
  });
}
