import prisma from "@/lib/db";

import KnockoutMatchForm from "@/components/forms/KnockoutMatchForm";

export default async function AddKnockoutMatchPage() {
  const tournaments = await prisma.tournament.findMany();

  return <KnockoutMatchForm tournaments={tournaments} />;
}
