import { getStartAndEndDates } from "@/lib/getFormattedDate";
import { getMatches } from "@/lib/getMatches";

export async function GET(
  request: Request,
  { params }: { params: { date: string } }
) {
  const { startDate, endDate } = getStartAndEndDates(params.date);

  const matches = await getMatches({
    date: { gte: startDate, lte: endDate },
  });

  return Response.json(matches);
}
