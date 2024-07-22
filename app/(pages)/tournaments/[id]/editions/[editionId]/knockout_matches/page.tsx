import prisma from "@/lib/db";
import KnockoutMatches from "@/components/KnockoutMatches";

const KnockoutMatchesPage = async ({
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

  return <KnockoutMatches matches={matches} />;
};

export default KnockoutMatchesPage;
