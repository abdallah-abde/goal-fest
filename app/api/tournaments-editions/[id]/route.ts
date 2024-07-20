import prisma from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const data = await prisma.tournamentEdition.findMany({
    where: { tournamentId: +params.id },
    include: { tournament: true },
  });

  return Response.json(data);
}
