import TournamentKnockoutMatchForm from "@/components/TournamentKnockoutMatchForm";
import prisma from "@/lib/db";

const AddTournamentKnockoutMatchPage = async () => {
  const teams = await prisma.team.findMany();

  return <TournamentKnockoutMatchForm teams={teams} />;
};

export default AddTournamentKnockoutMatchPage;
