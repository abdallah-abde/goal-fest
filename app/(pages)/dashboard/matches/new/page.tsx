import TournamentGroupMatchForm from "@/components/TournamentGroupMatchForm";
import prisma from "@/lib/db";

const AddTournamentGroupMatchPage = async () => {
  const tournaments = await prisma.tournament.findMany();
  const teams = await prisma.team.findMany();

  return <TournamentGroupMatchForm tournaments={tournaments} teams={teams} />;
};

export default AddTournamentGroupMatchPage;
