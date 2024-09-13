import KnockoutMatchForm from "@/components/forms/KnockoutMatchForm";
import prisma from "@/lib/db";

export default async function AddKnockoutMatchPage() {
  const tournaments = await prisma.tournament.findMany();

  return <KnockoutMatchForm tournaments={tournaments} />;
}
