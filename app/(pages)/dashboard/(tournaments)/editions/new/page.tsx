import prisma from "@/lib/db";

import EditionForm from "@/components/forms/EditionForm";

export default async function AddEditionPage() {
  const tournaments = await prisma.tournament.findMany();
  const teams = await prisma.team.findMany();
  const countries = await prisma.country.findMany();

  return (
    <EditionForm
      tournaments={tournaments}
      teams={teams}
      countries={countries}
    />
  );
}
