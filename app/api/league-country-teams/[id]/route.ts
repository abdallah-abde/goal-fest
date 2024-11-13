import prisma from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const league = await prisma.league.findUnique({ where: { id: +params.id } });

  if (!league) {
    return Response.json([]);
  }

  const where = league.countryId
    ? { countryId: league.countryId }
    : { type: league.type };

  const res = await prisma.leagueTeam.findMany({
    where: {
      ...where,
    },
  });

  return Response.json(res);
}
