import CountryForm from "@/components/CountryForm";
import prisma from "@/lib/db";

const EditCountryPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const country = await prisma.country.findUnique({
    where: { id: parseInt(id) },
  });

  return <CountryForm country={country} />;
};

export default EditCountryPage;
