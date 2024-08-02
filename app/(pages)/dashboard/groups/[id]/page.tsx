import GroupForm from "@/components/forms/GroupForm";
import prisma from "@/lib/db";

export default async function EditGroupPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const tournaments = await prisma.tournament.findMany();
  const teams = await prisma.team.findMany();

  const group = await prisma.group.findUnique({
    where: { id: +id },
    include: {
      teams: true,
      tournamentEdition: {
        include: {
          tournament: true,
        },
      },
    },
  });

  return <GroupForm tournaments={tournaments} teams={teams} group={group} />;
}
