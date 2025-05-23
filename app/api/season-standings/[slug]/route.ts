import {
  calculateTeamStatsByGroup,
  calculateTeamStatsBySlug,
} from "@/lib/calculateTeamStats";
import prisma from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  const season = await prisma.season.findUnique({
    where: { slug },
    include: { league: true, teams: true, groups: true },
  });

  if (!season) throw new Error("Something went wrong");

  if (
    !season.groups ||
    season.groups.length === 0 ||
    season.groups.length === 1
  ) {
    const standings = await Promise.all(
      season.teams.map(async (team) => ({
        ...team,
        stats: await calculateTeamStatsBySlug(team.id, slug),
      }))
    );

    return Response.json([
      {
        groupName: null,
        groupId: null,
        seasonId: season.id,
        teams: standings,
      },
    ]);
  } else {
    const groups = await prisma.group.findMany({
      where: {
        season: {
          slug,
        },
      },
      select: {
        id: true,
        name: true,
        seasonId: true,
        teams: true,
      },
    });

    const standings = await Promise.all(
      groups.map(async (group) => ({
        ...group,
        teams: await Promise.all(
          group.teams.map(async (team) => ({
            ...team,
            stats: await calculateTeamStatsByGroup(team.id, group.id),
          }))
        ),
      }))
    );

    return Response.json(
      standings.map((stand) => {
        return {
          groupName: stand.name,
          groupId: stand.id,
          seasonId: stand.seasonId,
          teams: stand.teams,
        };
      })
    );
  }
}
