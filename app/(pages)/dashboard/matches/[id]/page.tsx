import TournamentGroupMatchForm from "@/components/TournamentGroupMatchForm";
import prisma from "@/lib/db";

const EditTournamentGroupMatchPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const tournaments = await prisma.tournament.findMany();
  const teams = await prisma.team.findMany();

  const match = await prisma.match.findUnique({
    where: { id: +id },
    include: {
      homeTeam: true,
      awayTeam: true,
      group: true,
      tournamentEdition: {
        include: { tournament: true },
      },
    },
  });

  return (
    <TournamentGroupMatchForm
      tournaments={tournaments}
      teams={teams}
      match={match}
    />
  );
};

export default EditTournamentGroupMatchPage;
