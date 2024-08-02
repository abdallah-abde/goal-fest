import GroupForm from "@/components/forms/GroupForm";
import prisma from "@/lib/db";

export default async function AddGroupPage() {
  const tournaments = await prisma.tournament.findMany();
  const teams = await prisma.team.findMany();

  return <GroupForm tournaments={tournaments} teams={teams} />;
}
