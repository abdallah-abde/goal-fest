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
    },
    include: {
      homeTeam: true,
      awayTeam: true,
      tournamentEdition: true,
    },
  });
  return <KnockoutBrackets matches={matches} />;
  // return <div>Brackets</div>;
}
