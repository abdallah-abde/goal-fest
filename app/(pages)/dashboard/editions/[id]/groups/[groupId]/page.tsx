import TournamentGroupForm from "@/components/TournamentGroupForm";
import prisma from "@/lib/db";

const EditTournamentGroupPage = async ({
  params: { id, groupId },
}: {
  params: { id: string; groupId: string };
}) => {
  const group = await prisma.group.findUnique({ where: { id: +groupId } });
  const teams = await prisma.team.findMany();

  return <TournamentGroupForm group={group} teams={teams} />;
};

export default EditTournamentGroupPage;
