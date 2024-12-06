import prisma from "@/lib/db";
import { Continents } from "@/types/enums";

export async function GET(
  request: Request,
  { params }: { params: { id: string; value: string } }
) {
  const league = await prisma.league.findUnique({
    where: { id: +params.id },
  });

  if (!league) {
    return Response.json([]);
  }

  const where = {
    name: { contains: params.value },
    ...(league.continent === Continents.International
      ? {}
      : { continent: league.continent }),
  };

  const res = await prisma.team
    .findMany({
      where: {
        ...where,
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
