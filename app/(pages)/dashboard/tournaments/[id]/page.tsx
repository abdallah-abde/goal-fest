import TournamentForm from "@/components/TournamentForm";
import prisma from "@/lib/db";

const EditTournamentPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const tournament = await prisma.tournament.findUnique({
    where: { id: parseInt(id) },
  });

  return <TournamentForm tournament={tournament} />;
};

export default EditTournamentPage;
