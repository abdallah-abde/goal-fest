import prisma from "@/lib/db";

import EditionForm from "@/components/forms/EditionForm";

export default async function EditEditionPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const tournaments = await prisma.tournament.findMany();
  const teams = await prisma.team.findMany();
  const countries = await prisma.country.findMany();

  const tournamentEdition = await prisma.tournamentEdition.findUnique({
    where: { id: parseInt(id) },
    include: {
      hostingCountries: true,
      tournament: true,
      teams: true,
    },
  });

  if (!tournamentEdition) throw new Error("Something went wrong");

  return (
    <EditionForm
      tournaments={tournaments}
      tournamentEdition={tournamentEdition}
      teams={teams}
      countries={countries}
    />
  );
}
