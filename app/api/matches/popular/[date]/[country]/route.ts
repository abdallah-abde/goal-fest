import { getStartAndEndDates } from "@/lib/getFormattedDate";
import { getMatches } from "@/lib/getMatches";

export async function GET(
  request: Request,
  { params }: { params: { date: string; country: string | undefined } }
) {
  const { startDate, endDate } = getStartAndEndDates(params.date);

  const matches = await getMatches({
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
  });

  return Response.json(matches);
}
