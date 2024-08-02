import prisma from "@/lib/db";
import EditionHomeComponent from "@/components/lists/EditionHomeComponent";

export default async function EditionPage({
  params,
}: {
  params: { editionId: string };
}) {
  const tournamentEdition = await prisma.tournamentEdition.findUnique({
    where: {
      id: +params.editionId,
    },
    include: {
      teams: true,
      tournament: true,
      winner: true,
      titleHolder: true,
      hostingCountries: true,
    },
  });

  return <EditionHomeComponent tournamentEdition={tournamentEdition} />;
}
