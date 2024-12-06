import prisma from "@/lib/db";

import { getStartAndEndDates } from "@/lib/getFormattedDate";

export async function GET(
  request: Request,
  { params }: { params: { date: string; country: string } }
) {
  const { startDate, endDate } = getStartAndEndDates(params.date);

  const seasons = await prisma.season.findMany({
    where: {
      AND: [
        {
          OR: [
            {
              hostingCountries: {
                some: {
                  name: {
                    contains: params.country,
                  },
                },
              },
            },
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
          ],
        },
      ],
    },
    select: {
      league: {
        select: {
          name: true,
          flagUrl: true,
          isDomestic: true,
          isClubs: true,
        },
      },
      id: true,
      year: true,
      slug: true,
      flagUrl: true,
    },
  });

  return Response.json(seasons);
}
