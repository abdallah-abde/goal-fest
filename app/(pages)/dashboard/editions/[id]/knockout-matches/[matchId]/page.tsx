import TournamentKnockoutMatchForm from "@/components/TournamentKnockoutMatchForm";
import prisma from "@/lib/db";

const EditTournamentKnockoutMatchPage = async ({
  params: { id, matchId },
}: {
  params: { id: string; matchId: string };
}) => {
  const match = await prisma.knockoutMatch.findUnique({
    where: { id: +matchId },
  });
  const teams = await prisma.team.findMany();

  return <TournamentKnockoutMatchForm match={match} teams={teams} />;
};

export default EditTournamentKnockoutMatchPage;
