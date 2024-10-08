import prisma from "@/lib/db";

import KnockoutMatchForm from "@/components/forms/KnockoutMatchForm";

export default async function EditKnockoutMatchPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const tournaments = await prisma.tournament.findMany();

  const match = await prisma.knockoutMatch.findUnique({
    where: { id: +id },
    include: {
      tournamentEdition: {
        include: { tournament: true },
      },
    },
  });

  if (!match) throw new Error("Something went wrong");

  return <KnockoutMatchForm tournaments={tournaments} match={match} />;
}
