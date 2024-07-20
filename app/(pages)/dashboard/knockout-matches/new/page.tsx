import TournamentKnockoutMatchForm from "@/components/TournamentKnockoutMatchForm";
import prisma from "@/lib/db";

const AddTournamentKnockoutMatchPage = async () => {
  const tournaments = await prisma.tournament.findMany();
  const teams = await prisma.team.findMany();

  return (
    <TournamentKnockoutMatchForm tournaments={tournaments} teams={teams} />
  );
};

export default AddTournamentKnockoutMatchPage;
