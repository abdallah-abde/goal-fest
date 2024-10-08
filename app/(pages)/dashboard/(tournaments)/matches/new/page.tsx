import prisma from "@/lib/db";

import GroupMatchForm from "@/components/forms/GroupMatchForm";

export default async function AddGroupMatchPage() {
  const tournaments = await prisma.tournament.findMany();

  return <GroupMatchForm tournaments={tournaments} />;
}
