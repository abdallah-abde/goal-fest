"use server";

import prisma from "@/lib/db";
import fs from "fs/promises";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { CountrySchema } from "@/schemas";

export async function addCountry(prevState: unknown, formData: FormData) {
  const result = CountrySchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  const country = await prisma.country.findFirst({
    where: { name: data.name },
  });

  if (country) return { name: ["Country existed"] };

  // if (country) return { result.error.formErrors.fieldErrors };

  let flagUrlPath = "";
  if (data.flagUrl != null && data.flagUrl.size > 0) {
    flagUrlPath = `/countries/${crypto.randomUUID()}-${data.flagUrl.name}`;

    await fs.writeFile(
      `public${flagUrlPath}`,
      Buffer.from(await data.flagUrl.arrayBuffer())
    );
  }

  await prisma.country.create({
    data: {
      name: data.name.toString(),
      flagUrl: flagUrlPath,
    },
  });

  revalidatePath("/dashboard/countries");
  redirect("/dashboard/countries");
}

export async function updateCountry(
  id: number,
  prevState: unknown,
  formData: FormData
) {
  const result = CountrySchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  const country = await prisma.country.findUnique({ where: { id } });

  if (country == null) return notFound();

  let flagUrlPath = country.flagUrl;
  if (data.flagUrl != null && data.flagUrl.size > 0) {
    if (country.flagUrl) await fs.unlink(`public${country.flagUrl}`);

    flagUrlPath = `/countries/${crypto.randomUUID()}-${data.flagUrl.name}`;

    await fs.writeFile(
      `public${flagUrlPath}`,
      Buffer.from(await data.flagUrl.arrayBuffer())
    );
  }

  await prisma.country.update({
    where: { id },
    data: {
      name: data.name.toString(),
      flagUrl: flagUrlPath,
    },
  });

  revalidatePath("/dashboard/countries");
  redirect("/dashboard/countries");
}
