import TeamForm from "@/components/TeamForm";
import prisma from "@/lib/db";

const EditTeamPage = async ({ params: { id } }: { params: { id: string } }) => {
  const team = await prisma.team.findUnique({
    where: { id: parseInt(id) },
  });

  return <TeamForm team={team} />;
};

export default EditTeamPage;
