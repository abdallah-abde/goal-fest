import prisma from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string; value: string } }
) {
  const data = await prisma.season
    .findUnique({
      where: {
        id: +params.id,
        teams: {
          some: {
            name: { contains: params.value },
          },
        },
      },
      select: {
        teams: {
          include: {
            country: true,
          },
        },
      },
    })
    .then((data) =>
      data?.teams.map((a) => {
        return {
          label: `${a.name} (${a.isClub ? a.country?.name : a.continent})`,
          value: `${a.name} (${a.isClub ? a.country?.name : a.continent})`,
          dbValue: a.id.toString(),
        };
      })
    );

  return Response.json(data);
}
