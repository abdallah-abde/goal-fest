"use server";

import prisma from "@/lib/db";
import fs from "fs/promises";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import { ImageSchema } from "@/schemas";

const schema = z.object({
  name: z.string().min(2),
  logoUrl: ImageSchema.optional(),
});

export async function addTournament(prevState: unknown, formData: FormData) {
  const result = schema.safeParse(Object.fromEntries(formData.entries()));

  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  let logoUrlPath = "";
  if (data.logoUrl != null && data.logoUrl.size > 0) {
    logoUrlPath = `/tournaments/${crypto.randomUUID()}-${data.logoUrl.name}`;

    await fs.writeFile(
      `public${logoUrlPath}`,
      Buffer.from(await data.logoUrl.arrayBuffer())
    );
  }

  await prisma.tournament.create({
    data: {
      name: data.name.toString(),
      logoUrl: logoUrlPath,
    },
  });

  revalidatePath("/dashboard/tournaments");
  redirect("/dashboard/tournaments");
}

export async function updateTournament(
  id: number,
  prevState: unknown,
  formData: FormData
) {
  const result = schema.safeParse(Object.fromEntries(formData.entries()));

  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  const tournament = await prisma.tournament.findUnique({ where: { id } });

  if (tournament == null) return notFound();

  let logoUrlPath = tournament.logoUrl;
  if (data.logoUrl != null && data.logoUrl.size > 0) {
    if (tournament.logoUrl) await fs.unlink(`public${tournament.logoUrl}`);

    logoUrlPath = `/tournaments/${crypto.randomUUID()}-${data.logoUrl.name}`;

    await fs.writeFile(
      `public${logoUrlPath}`,
      Buffer.from(await data.logoUrl.arrayBuffer())
    );
  }

  await prisma.tournament.update({
    where: { id },
    data: {
      name: data.name.toString(),
      logoUrl: logoUrlPath,
    },
  });

  revalidatePath("/dashboard/tournaments");
  redirect("/dashboard/tournaments");
}
