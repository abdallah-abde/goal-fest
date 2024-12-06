import prisma from "@/lib/db";
import { Continents } from "@/types/enums";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const league = await prisma.league.findUnique({
    where: { id: +params.id },
  });

  if (!league) {
    return Response.json([]);
  }

  const where =
    league.continent === Continents.International
      ? {}
      : { continent: league.continent };

  const res = await prisma.country.findMany({
    where: {
      ...where,
    },
  });

  return Response.json(res);
}
