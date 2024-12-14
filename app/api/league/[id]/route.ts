import prisma from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const league = await prisma.league.findUnique({
    where: { id: +params.id },
  });

  return Response.json(league);
}
