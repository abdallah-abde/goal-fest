import CurrentStageForm from "@/components/forms/CurrentStageForm";
import prisma from "@/lib/db";

export default async function EditEditionPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const tournamentEdition = await prisma.tournamentEdition.findUnique({
    where: { id: parseInt(id) },
    include: {
      hostingCountries: true,
      tournament: true,
      teams: true,
    },
  });

  if (!tournamentEdition) throw new Error("Something went wrong");

  return <CurrentStageForm tournamentEdition={tournamentEdition} />;
}
