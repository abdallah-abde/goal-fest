import prisma from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const data = await prisma.group.findMany({
    where: { id: +params.id },
    include: { teams: true },
  });

  return Response.json(data);
}
