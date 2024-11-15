import prisma from "@/lib/db";
import { TournamentTypes } from "@/types/enums";

export async function GET(
  request: Request,
  { params }: { params: { id: string; value: string } }
) {
  const tournament = await prisma.tournament.findUnique({
    where: { id: +params.id },
  });

  if (!tournament) {
    return Response.json([]);
  }

  const where = {
    name: { contains: params.value },
    ...(tournament.type === TournamentTypes.International
      ? {}
      : { type: tournament.type }),
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
