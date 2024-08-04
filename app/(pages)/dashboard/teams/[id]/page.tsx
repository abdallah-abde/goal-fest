import TeamForm from "@/components/forms/TeamForm";
import prisma from "@/lib/db";

export default async function EditTeamPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const team = await prisma.team.findUnique({
    where: { id: parseInt(id) },
  });

  if (!team) throw new Error("Something went wrong");

  return <TeamForm team={team} />;
}
