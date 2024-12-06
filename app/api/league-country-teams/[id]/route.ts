import prisma from "@/lib/db";
import { Continents } from "@/types/enums";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const league = await prisma.league.findUnique({
    where: { id: +params.id },
    include: {
      country: true,
    },
  });

  if (!league) {
    return Response.json([]);
  }
  const isContinent = league.country?.name
    ? Object.values(Continents)
        .map((a) => a.toString())
        .includes(league.country?.name)
    : false;

  const where =
    league.countryId && !isContinent
      ? { countryId: league.countryId }
      : { continent: league.continent };

  const res = await prisma.team.findMany({
    where: {
      ...where,
    },
  });

  return Response.json(res);
}