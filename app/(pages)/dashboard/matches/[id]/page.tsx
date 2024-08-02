import GroupMatchForm from "@/components/forms/GroupMatchForm";
import prisma from "@/lib/db";

export default async function EditGroupMatchPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const tournaments = await prisma.tournament.findMany();
  const teams = await prisma.team.findMany();

  const match = await prisma.match.findUnique({
    where: { id: +id },
    include: {
      homeTeam: true,
      awayTeam: true,
      group: true,
      tournamentEdition: {
        include: { tournament: true },
      },
    },
  });

  return (
    <GroupMatchForm tournaments={tournaments} teams={teams} match={match} />
  );
}
