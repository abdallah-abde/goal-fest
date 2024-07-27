import prisma from "@/lib/db";
import TournamentEditionComponent from "@/components/TournamentEditionComponent";
import TournamentEditionHomeComponent from "@/components/TournamentEditionHomeComponent";

interface Props {
  params: { editionId: string };
}

const TournamentEditionPage = async ({
  params,
}: {
  params: { editionId: string };
}) => {
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

  return (
    <TournamentEditionHomeComponent tournamentEdition={tournamentEdition} />
  );
};

export default TournamentEditionPage;
