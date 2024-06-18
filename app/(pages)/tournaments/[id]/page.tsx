import { FC } from "react";
import prisma from "@/lib/db";

import TournamentEditionList from "@/components/TournamentEditionList";

interface Props {
  params: { id: string };
}

const TournamentPage: FC<Props> = async ({ params }) => {
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
