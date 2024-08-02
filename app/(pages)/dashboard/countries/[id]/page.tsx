import CountryForm from "@/components/forms/CountryForm";
import prisma from "@/lib/db";

export default async function EditCountryPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const country = await prisma.country.findUnique({
    where: { id: parseInt(id) },
  });

  return <CountryForm country={country} />;
}
