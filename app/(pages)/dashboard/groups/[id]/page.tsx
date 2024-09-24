import prisma from "@/lib/db";

import GroupForm from "@/components/forms/GroupForm";

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

  if (!group) throw new Error("Something went wrong");

  return <GroupForm tournaments={tournaments} group={group} />;
}
