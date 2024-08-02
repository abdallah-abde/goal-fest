import prisma from "@/lib/db";

import EditionsCards from "@/components/lists/EditionsCards";

export default async function EditionsPage({
  params,
}: {
  params: { id: string };
}) {
  const tournamentEditions = await prisma.tournamentEdition.findMany({
    where: {
      tournamentId: +params.id,
    },
    include: {
      tournament: true,
    },
  });

  return <EditionsCards tournamentEditions={tournamentEditions} />;
}
