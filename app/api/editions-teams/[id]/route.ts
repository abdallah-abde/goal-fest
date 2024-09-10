import prisma from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const data = await prisma.tournamentEdition.findMany({
    where: { id: +params.id },
    select: { teams: true },
  });

  return Response.json(data);
}
