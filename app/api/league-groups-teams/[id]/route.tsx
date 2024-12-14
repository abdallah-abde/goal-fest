import prisma from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const data = await prisma.group.findUnique({
    where: { id: +params.id },
    select: {
      teams: {
        select: {
          id: true,
          name: true,
          code: true,
          country: true,
        },
      },
    },
  });

  return Response.json(data);
}
