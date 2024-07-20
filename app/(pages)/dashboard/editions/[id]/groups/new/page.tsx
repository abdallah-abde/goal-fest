import TournamentGroupForm from "@/components/TournamentGroupForm";
import prisma from "@/lib/db";

const AddTournamentGroupPage = async () => {
  const teams = await prisma.team.findMany();

  return <TournamentGroupForm teams={teams} />;
};

export default AddTournamentGroupPage;
