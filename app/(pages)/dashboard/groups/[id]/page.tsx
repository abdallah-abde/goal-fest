import TournamentGroupForm from "@/components/TournamentGroupForm";
import prisma from "@/lib/db";

const EditTournamentGroupPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
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

  return (
    <TournamentGroupForm
      tournaments={tournaments}
      teams={teams}
      group={group}
    />
  );
};

export default EditTournamentGroupPage;
