import prisma from "@/lib/db";
import TournamentEditionComponent from "@/components/TournamentEditionComponent";

interface Props {
  params: { editionId: string };
}

const TournamentEditionPage: React.FC<Props> = async ({ params }) => {
  const tournamentEdition = await prisma.tournamentEdition.findUnique({
    where: {
      id: +params.editionId,
    },
    include: {
      teams: true,
      tournament: true,
      winner: true,
      hostingCountries: true,
    },
  });

  return <TournamentEditionComponent tournamentEdition={tournamentEdition} />;
};

export default TournamentEditionPage;
