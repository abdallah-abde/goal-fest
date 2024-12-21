import prisma from "@/lib/db";

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

  const countryCondition =
    league.countryId && league.isDomestic
      ? { countryId: league.countryId }
      : { continent: league.continent };

  const isClubsCondition = { isClub: league.isClubs };

  const where = {
    ...countryCondition,
    ...isClubsCondition,
  };

  const res = await prisma.team.findMany({
    where: {
      ...where,
    },
  });

  return Response.json(res);
}
