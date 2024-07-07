import TournamentEditionForm from "@/components/TournamentEditionForm";
import prisma from "@/lib/db";

const AddTournamentPage = async () => {
  const tournaments = await prisma.tournament.findMany();

  return <TournamentEditionForm tournaments={tournaments} />;
};

export default AddTournamentPage;
