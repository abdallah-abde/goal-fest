import prisma from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string; value: string } }
) {
  const res = await prisma.group
    .findMany({
      where: {
        tournamentEditionId: +params.id,
        name: { contains: params.value },
      },
    })
    .then((data) =>
      data.map((a) => {
        return {
          label: `${a.name}`,
          value: `${a.name}`,
          dbValue: a.id.toString(),
        };
      })
    );

  return Response.json(res);
}
