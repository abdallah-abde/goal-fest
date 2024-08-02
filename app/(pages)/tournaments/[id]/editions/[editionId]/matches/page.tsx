import prisma from "@/lib/db";
import GroupMatchesCards from "@/components/lists/GroupMatchesCards";

export default async function GroupMatchesPage({
  params,
}: {
  params: { editionId: string };
}) {
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

  return <GroupMatchesCards matches={matches} />;
}
