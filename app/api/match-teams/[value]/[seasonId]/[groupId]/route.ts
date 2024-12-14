import { getStartAndEndDates } from "@/lib/getFormattedDate";
import prisma from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { value: string; seasonId: string; groupId: string } }
) {
  const group = await prisma.group
    .findUnique({
      where: {
        id: +params.groupId,
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

  return Response.json(group || "");
}
