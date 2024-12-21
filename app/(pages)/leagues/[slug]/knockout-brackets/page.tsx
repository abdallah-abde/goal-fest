import prisma from "@/lib/db";

import KnockoutBrackets from "@/components/KnockoutBrackets";

export default async function KnockoutBracketsPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const matches = await prisma.match.findMany({
    where: {
      season: {
        slug,
      },
      isKnockout: true,
    },
    include: {
      homeTeam: true,
      awayTeam: true,
      season: true,
    },
  });
  // return <KnockoutBrackets matches={matches} />;
  return <div>Brackets</div>;
}
