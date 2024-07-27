import prisma from "@/lib/db";
import TournamentEditionHomeComponent from "@/components/TournamentEditionHomeComponent";

const HomePage = async ({ params }: { params: { editionId: string } }) => {
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

export default HomePage;
