import TournamentKnockoutMatchForm from "@/components/TournamentKnockoutMatchForm";
import prisma from "@/lib/db";

const EditTournamentKnockoutMatchPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const tournaments = await prisma.tournament.findMany();
  const teams = await prisma.team.findMany();

  const match = await prisma.knockoutMatch.findUnique({
    where: { id: +id },
    include: {
      tournamentEdition: {
        include: { tournament: true },
      },
    },
  });

  return (
    <TournamentKnockoutMatchForm
      tournaments={tournaments}
      teams={teams}
      match={match}
    />
  );
};

export default EditTournamentKnockoutMatchPage;
