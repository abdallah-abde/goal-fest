import { FC } from "react";
import prisma from "@/lib/db";

import KnockoutBrackets from "@/components/KnockoutBrackets";

interface Props {
  params: { editionId: string };
}

const KnockoutBracketsPage: FC<Props> = async ({ params }) => {
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
  // return <KnockoutBrakets matches={matches} />;
  return <div>Brackets</div>;
};

export default KnockoutBracketsPage;
