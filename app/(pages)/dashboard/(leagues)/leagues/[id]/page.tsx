import prisma from "@/lib/db";

import LeagueForm from "@/components/forms/LeagueForm";

export default async function EditLeaguePage({
  params: { id },
}: {
  params: { id: string };
}) {
  const league = await prisma.league.findUnique({
    where: { id: parseInt(id) },
  });

  if (!league) throw new Error("Something went wrong");

  const countries = await prisma.country.findMany();

  return <LeagueForm league={league} countries={countries} />;
}
