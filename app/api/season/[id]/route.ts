import prisma from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const season = await prisma.season.findUnique({
    where: { id: +params.id },
    include: {
      groups: true,
    },
  });

  return Response.json(season);
}
