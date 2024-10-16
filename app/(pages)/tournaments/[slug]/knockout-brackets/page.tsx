import prisma from "@/lib/db";

import KnockoutBrackets from "@/components/KnockoutBrackets";

export default async function KnockoutBracketsPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const matches = await prisma.knockoutMatch.findMany({
    where: {
      tournamentEdition: {
        slug,
      },
    },
    include: {
      homeTeam: true,
      awayTeam: true,
      tournamentEdition: true,
    },
  });
  // return <KnockoutBrackets matches={matches} />;
  return <div>Brackets</div>;
}
