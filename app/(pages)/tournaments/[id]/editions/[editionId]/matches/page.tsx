import prisma from "@/lib/db";
import GroupMatchList from "@/components/GroupMatchList";

const GroupMatchesPage = async ({
  params,
}: {
  params: { editionId: string };
}) => {
  const matches = await prisma.match.findMany({
    where: {
      tournamentEditionId: +params.editionId,
    },
    include: {
      homeTeam: true,
      awayTeam: true,
      tournamentEdition: true,
      group: true,
    },
  });

  return <GroupMatchList matches={matches} />;
};

export default GroupMatchesPage;
