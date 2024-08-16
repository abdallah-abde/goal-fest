import KnockoutMatchForm from "@/components/forms/KnockoutMatchForm";
import prisma from "@/lib/db";

export default async function EditKnockoutMatchPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const tournaments = await prisma.tournament.findMany();
  const teams = await prisma.team.findMany();

  const match = await prisma.knockoutMatch.findUnique({
    where: { id: +id },
    include: {
      tournamentEdition: {
        include: { tournament: true },
      },
    },
  });

  if (!match) throw new Error("Something went wrong");

  return (
    <KnockoutMatchForm tournaments={tournaments} teams={teams} match={match} />
  );
}
