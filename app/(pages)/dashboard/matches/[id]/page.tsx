import prisma from "@/lib/db";

import GroupMatchForm from "@/components/forms/GroupMatchForm";

export default async function EditGroupMatchPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const tournaments = await prisma.tournament.findMany();

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

  if (!match) throw new Error("Something went wrong");

  return <GroupMatchForm tournaments={tournaments} match={match} />;
}
