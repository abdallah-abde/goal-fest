import TournamentGroupMatchForm from "@/components/TournamentGroupMatchForm";
import prisma from "@/lib/db";

const EditTournamentGroupMatchPage = async ({
  params: { id, groupId, matchId },
}: {
  params: { id: string; groupId: string; matchId: string };
}) => {
  const match = await prisma.match.findUnique({ where: { id: +matchId } });
  const teams = await prisma.team.findMany();

  return <TournamentGroupMatchForm match={match} teams={teams} />;
};

export default EditTournamentGroupMatchPage;
