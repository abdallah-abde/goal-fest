import prisma from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const data = await prisma.group.findMany({
    where: { tournamentEditionId: +params.id },
    include: { tournamentEdition: true },
  });

  return Response.json(data);
}
