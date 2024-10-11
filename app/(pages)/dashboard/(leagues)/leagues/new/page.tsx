import prisma from "@/lib/db";

import LeagueForm from "@/components/forms/LeagueForm";

export default async function AddLeaguePage() {
  const countries = await prisma.country.findMany();

  return <LeagueForm countries={countries} />;
}
