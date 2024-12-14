import prisma from "@/lib/db";
import { Continents } from "@/types/enums";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: {
      value: string;
      continent: string;
      country: string;
      isClubs: string;
      isDomestic: string;
    };
  }
) {
  const countryCondition =
    params.country && params.isDomestic === "true"
      ? { countryId: +params.country }
      : params.continent === Continents.International
      ? {}
      : { continent: params.continent };

  const where = {
    name: { contains: params.value },
    isClub: params.isClubs === "true",
    ...countryCondition,
  };

  const res = await prisma.team
    .findMany({
      where: {
        ...where,
      },
      include: {
        country: true,
      },
    })
    .then((data) =>
      data.map((a) => {
        return {
          label: `${a.name} (${a.isClub ? a.country?.name : a.continent})`,
          value: `${a.name} (${a.isClub ? a.country?.name : a.continent})`,
          dbValue: a.id.toString(),
        };
      })
    );

  return Response.json(res);
}
