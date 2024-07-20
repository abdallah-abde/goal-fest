import TournamentGroupForm from "@/components/TournamentGroupForm";
import prisma from "@/lib/db";

const AddTournamentGroupPage = async () => {
  const tournaments = await prisma.tournament.findMany();
  const teams = await prisma.team.findMany();

  return <TournamentGroupForm tournaments={tournaments} teams={teams} />;
};

export default AddTournamentGroupPage;
