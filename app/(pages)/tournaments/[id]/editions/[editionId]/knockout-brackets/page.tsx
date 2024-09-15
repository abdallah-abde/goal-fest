import prisma from "@/lib/db";

import KnockoutBrackets from "@/components/KnockoutBrackets";

export default async function KnockoutBracketsPage({
  params,
}: {
  params: { editionId: string; id: string };
}) {
  const matches = await prisma.knockoutMatch.findMany({
    where: {
      tournamentEditionId: +params.editionId,
      tournamentEdition: {
        tournamentId: +params.id,
      },
    },
    include: {
      homeTeam: true,
      awayTeam: true,
      tournamentEdition: true,
    },
  });
  // return <KnockoutBrakets matches={matches} />;
  return <div>Brackets</div>;
}
