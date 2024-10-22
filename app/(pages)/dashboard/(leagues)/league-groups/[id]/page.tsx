import prisma from "@/lib/db";

import LeagueGroupForm from "@/components/forms/LeagueGroupForm";

export default async function EditLeagueGroupPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const leagues = await prisma.league.findMany();

  const group = await prisma.leagueGroup.findUnique({
    where: { id: +id },
    include: {
      teams: true,
      season: {
        include: {
          league: {
            include: {
              country: true,
            },
          },
        },
      },
    },
  });

  if (!group) throw new Error("Something went wrong");

  return <LeagueGroupForm leagues={leagues} group={group} />;
}
