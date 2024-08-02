import prisma from "@/lib/db";
import KnockoutMatchesCards from "@/components/lists/KnockoutMatchesCards";

export default async function KnockoutMatchesPage({
  params,
}: {
  params: { editionId: string };
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

  // await new Promise((resolve) => {
  //   setTimeout(() => {}, 300);
  // });

  return <KnockoutMatchesCards matches={matches} />;
}
