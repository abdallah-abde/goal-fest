import prisma from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { value: string } }
) {
  const res = await prisma.country
    .findMany({
      where: {
        name: { contains: params.value },
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
