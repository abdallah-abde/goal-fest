import TournamentEditionForm from "@/components/TournamentEditionForm";
import prisma from "@/lib/db";

const AddTournamentPage = async () => {
  const tournaments = await prisma.tournament.findMany();
  const teams = await prisma.team.findMany();
  const countries = await prisma.country.findMany();

  return (
    <TournamentEditionForm
      tournaments={tournaments}
      teams={teams}
      countries={countries}
    />
  );
};

export default AddTournamentPage;
