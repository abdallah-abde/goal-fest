import prisma from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { value: string } }
) {
  const res = await prisma.league
    .findMany({
      where: {
        name: { contains: params.value },
      },
      include: { country: true },
    })
    .then((data) =>
      data.map((a) => {
        return {
          label: `${a.name} ${
            a.country ? `(${a.country.name})` : `(${a.type})`
          }`,
          value: `${a.name} ${
            a.country ? `(${a.country.name})` : `(${a.type})`
          }`,
          dbValue: a.id.toString(),
        };
      })
    );

  return Response.json(res);
}
