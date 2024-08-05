"use server";

import prisma from "@/lib/db";
import fs from "fs/promises";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import { imageSchema } from "./schema";

const addSchema = z.object({
  name: z.string().min(2),
  flagUrl: imageSchema.optional(),
});

export async function addCountry(prevState: unknown, formData: FormData) {
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()));

  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  let imagePath = "";
  if (data.flagUrl != null && data.flagUrl.size > 0) {
    imagePath = `/countries/${crypto.randomUUID()}-${data.flagUrl.name}`;

    await fs.writeFile(
      `public${imagePath}`,
      Buffer.from(await data.flagUrl.arrayBuffer())
    );
  }

  await prisma.country.create({
    data: {
      name: data.name.toString(),
      flagUrl: imagePath,
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
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()));

  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  const country = await prisma.country.findUnique({ where: { id } });

  if (country == null) return notFound();

  let imagePath = country.flagUrl;
  if (data.flagUrl != null && data.flagUrl.size > 0) {
    if (country.flagUrl) await fs.unlink(`public${country.flagUrl}`);

    imagePath = `/countries/${crypto.randomUUID()}-${data.flagUrl.name}`;

    await fs.writeFile(
      `public${imagePath}`,
      Buffer.from(await data.flagUrl.arrayBuffer())
    );
  }

  await prisma.country.update({
    where: { id },
    data: {
      name: data.name.toString(),
      flagUrl: imagePath,
    },
  });

  revalidatePath("/dashboard/countries");
  redirect("/dashboard/countries");
}
