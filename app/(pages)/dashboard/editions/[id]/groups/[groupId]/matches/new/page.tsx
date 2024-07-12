import TournamentGroupMatchForm from "@/components/TournamentGroupMatchForm";
import prisma from "@/lib/db";

const AddTournamentGroupMatchPage = async () => {
  const teams = await prisma.team.findMany();

  return <TournamentGroupMatchForm teams={teams} />;
};

export default AddTournamentGroupMatchPage;
