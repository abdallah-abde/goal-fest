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
  
    const edition = await prisma.tournamentEdition.findUnique({
      where: { slug },
      include: { tournament: true, teams: true, groups: true },
    });
  
    if (!edition) throw new Error("Something went wrong");
  
    if (
      !edition.groups ||
      edition.groups.length === 0 ||
      edition.groups.length === 1
    ) {
      const standings = await Promise.all(
        edition.teams.map(async (team) => ({
          ...team,
          stats: await calculateTeamStatsBySlug(team.id, slug, "tournaments"),
        }))
      );
  
      return Response.json([
        {
          groupName: null,
          groupId: null,
          tournamentOrLeagueId: edition.id,
          type: "tournaments",
          teams: standings,
        },
      ]);
    } else {
      const groups = await prisma.group.findMany({
        where: {
          tournamentEdition: {
            slug,
          },
        },
        select: {
          id: true,
          name: true,
          tournamentEditionId: true,
          teams: true,
        },
      });
  
      const standings = await Promise.all(
        groups.map(async (group) => ({
          ...group,
          teams: await Promise.all(
            group.teams.map(async (team) => ({
              ...team,
              stats: await calculateTeamStatsByGroup(
                team.id,
                group.id,
                "tournaments"
              ),
            }))
          ),
        }))
      );
  
      return Response.json(
        standings.map((stand) => {
          return {
            groupName: stand.name,
            groupId: stand.id,
            tournamentOrLeagueId: stand.tournamentEditionId,
            type: "tournaments",
            teams: stand.teams,
          };
        })
      );
    }
  }
  