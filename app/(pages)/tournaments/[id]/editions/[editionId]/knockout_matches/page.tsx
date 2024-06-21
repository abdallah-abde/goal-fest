import { FC } from "react";
import prisma from "@/lib/db";
import KnockoutMatches from "@/components/KnockoutMatches";

interface Props {
  params: { editionId: string };
}

const KnockoutMatchesPage: FC<Props> = async ({ params }) => {
  const matches = await prisma.knockoutMatch.findMany({
    where: {
      tournamentEditionId: +params.editionId,
    },
    include: {
      homeTeam: true,
      awayTeam: true,
      tournamentEdition: true,
    },
  });
  return <KnockoutMatches matches={matches} />;
};

export default KnockoutMatchesPage;
