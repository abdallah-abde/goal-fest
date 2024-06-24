import prisma from "@/lib/db";
import TournamentEditionComponent from "@/components/TournamentEditionComponent";

interface Props {
  params: { editionId: string };
}

const TournamentEditionPage: React.FC<Props> = async ({ params }) => {
  const tournamentEdition = await prisma.tournamentEdition.findFirst({
    where: {
      id: +params.editionId,
    },
    include: {
      teams: true,
      tournament: true,
      groups: true,
      matches: true,
    },
  });

  return <TournamentEditionComponent tournamentEdition={tournamentEdition} />;
};

export default TournamentEditionPage;
