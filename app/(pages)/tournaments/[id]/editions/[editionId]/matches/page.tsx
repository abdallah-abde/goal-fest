import { FC } from "react";
import prisma from "@/lib/db";
import GroupMatchList from "@/components/GroupMatchList";

interface Props {
  params: { editionId: string };
}

const GroupMatchesPage: FC<Props> = async ({ params }) => {
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
