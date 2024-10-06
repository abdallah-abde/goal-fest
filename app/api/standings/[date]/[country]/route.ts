import {
  switchGroupMatchesToNeutralMatches,
  switchKnockoutMatchesToNeutralMatches,
  switchLeagueMatchesToNeutralMatches,
} from "@/lib/data/switchers";
import prisma from "@/lib/db";
import { getStartAndEndDates } from "@/lib/getFormattedDate";

export async function GET(
  request: Request,
  { params }: { params: { date: string; country: string } }
) {
  const { startDate, endDate } = getStartAndEndDates(params.date);

  const standings = await prisma.standing.findMany({
    where: {
      season: {
        matches: {
          some: {
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
        },
      },
    },
    include: {
      season: { include: { league: true } },
      team: true,
    },
    orderBy: {
      points: "desc",
    },
  });

  return Response.json(standings);
}
