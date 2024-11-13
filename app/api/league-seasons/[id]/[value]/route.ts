import prisma from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string; value: string } }
) {
  const res = await prisma.leagueSeason
    .findMany({
      where: {
        leagueId: +params.id,
        year: { contains: params.value },
      },
      include: {
        league: true,
      },
    })
    .then((data) =>
      data.map((a) => {
        return {
          label: `${a.league.name} ${a.year}`,
          value: `${a.league.name} ${a.year}`,
          dbValue: a.id.toString(),
        };
      })
    );

  return Response.json(res);
}
