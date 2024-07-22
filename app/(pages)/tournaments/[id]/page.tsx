import prisma from "@/lib/db";

import TournamentEditionList from "@/components/TournamentEditionList";

const TournamentPage = async ({ params }: { params: { id: string } }) => {
  const tournamentEditions = await prisma.tournamentEdition.findMany({
    where: {
      tournamentId: +params.id,
    },
    include: {
      tournament: true,
    },
  });

  return <TournamentEditionList tournamentEditions={tournamentEditions} />;
};

export default TournamentPage;
