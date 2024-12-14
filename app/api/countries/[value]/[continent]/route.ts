import prisma from "@/lib/db";
import { Continents } from "@/types/enums";
import { League } from "@prisma/client";

export async function GET(
  request: Request,
  { params }: { params: { value: string; continent: string } }
) {
  const continentCondition =
    params.continent === Continents.International
      ? {}
      : { continent: params.continent };

  const res = await prisma.country
    .findMany({
      where: {
        name: { contains: params.value },
        ...continentCondition,
      },
    })
    .then((data) =>
      data.map((a) => {
        return {
          label: `${a.name} (${a.continent})`,
          value: `${a.name} (${a.continent})`,
          dbValue: a.id.toString(),
        };
      })
    );

  return Response.json(res);
}
