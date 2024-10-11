import prisma from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const data = await prisma.leagueSeason.findMany({
    where: { leagueId: +params.id },
    include: { league: true },
  });

  return Response.json(data);
}
