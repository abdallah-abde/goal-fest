import TournamentEditionForm from "@/components/TournamentEditionForm";
import prisma from "@/lib/db";

const EditTournamentEditionPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const tournaments = await prisma.tournament.findMany();
  const teams = await prisma.team.findMany();
  const countries = await prisma.country.findMany();

  const tournamentEdition = await prisma.tournamentEdition.findUnique({
    where: { id: parseInt(id) },
    include: {
      hostingCountries: true,
      tournament: true,
      teams: true,
    },
  });

  return (
    <TournamentEditionForm
      tournaments={tournaments}
      tournamentEdition={tournamentEdition}
      teams={teams}
      countries={countries}
    />
  );
};

export default EditTournamentEditionPage;
