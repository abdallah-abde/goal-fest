import prisma from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string; value: string } }
) {
  const res = await prisma.tournamentEdition
    .findMany({
      where: {
        tournamentId: +params.id,
        year: { contains: params.value },
      },
      include: {
        tournament: true,
      },
    })
    .then((data) =>
      data.map((a) => {
        return {
          label: `${a.tournament.name} ${a.year}`,
          value: `${a.tournament.name} ${a.year}`,
          dbValue: a.id.toString(),
        };
      })
    );

  return Response.json(res);
}
