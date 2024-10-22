import prisma from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const data = await prisma.leagueGroup.findMany({
    where: { seasonId: +params.id },
    include: { season: true },
  });

  return Response.json(data);
}
