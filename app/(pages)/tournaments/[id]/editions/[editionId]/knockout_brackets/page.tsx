import prisma from "@/lib/db";

import KnockoutBrackets from "@/components/KnockoutBrackets";

const KnockoutBracketsPage = async ({
  params,
}: {
  params: { editionId: string };
}) => {
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
