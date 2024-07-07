import TournamentEditionForm from "@/components/TournamentEditionForm";
import prisma from "@/lib/db";

const EditTournamentEditionPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  console.log(id);
  const tournaments = await prisma.tournament.findMany();

  const tournamentEdition = await prisma.tournamentEdition.findUnique({
    where: { id: parseInt(id) },
  });

  return (
    <TournamentEditionForm
      tournaments={tournaments}
      tournamentEdition={tournamentEdition}
    />
  );
};

export default EditTournamentEditionPage;
