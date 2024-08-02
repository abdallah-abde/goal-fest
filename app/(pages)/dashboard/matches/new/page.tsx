import GroupMatchForm from "@/components/forms/GroupMatchForm";
import prisma from "@/lib/db";

export default async function AddGroupMatchPage() {
  const tournaments = await prisma.tournament.findMany();
  const teams = await prisma.team.findMany();

  return <GroupMatchForm tournaments={tournaments} teams={teams} />;
}
