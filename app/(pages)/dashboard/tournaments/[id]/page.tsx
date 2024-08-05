import TournamentForm from "@/components/forms/TournamentForm";
import prisma from "@/lib/db";

export default async function EditTournamentPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const tournament = await prisma.tournament.findUnique({
    where: { id: parseInt(id) },
  });

  if (!tournament) throw new Error("Something went wrong");

  return <TournamentForm tournament={tournament} />;
}
