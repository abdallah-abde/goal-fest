"use server";

import prisma from "@/lib/db";
import fs from "fs/promises";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import { imageSchema } from "./schema";

const addSchema = z.object({
  name: z.string().min(2),
  logoUrl: imageSchema.optional(),
});

export async function addTournament(prevState: unknown, formData: FormData) {
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()));

  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  let imagePath = "";
  if (data.logoUrl != null && data.logoUrl.size > 0) {
    imagePath = `/tournaments/${crypto.randomUUID()}-${data.logoUrl.name}`;

    await fs.writeFile(
      `public${imagePath}`,
      Buffer.from(await data.logoUrl.arrayBuffer())
    );
  }

  await prisma.tournament.create({
    data: {
      name: data.name.toString(),
      logoUrl: imagePath,
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
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()));

  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  const tournament = await prisma.tournament.findUnique({ where: { id } });

  if (tournament == null) return notFound();

  let imagePath = tournament.logoUrl;
  if (data.logoUrl != null && data.logoUrl.size > 0) {
    if (tournament.logoUrl) await fs.unlink(`public${tournament.logoUrl}`);

    imagePath = `/tournaments/${crypto.randomUUID()}-${data.logoUrl.name}`;

    await fs.writeFile(
      `public${imagePath}`,
      Buffer.from(await data.logoUrl.arrayBuffer())
    );
  }

  await prisma.tournament.update({
    where: { id },
    data: {
      name: data.name.toString(),
      logoUrl: imagePath,
    },
  });

  revalidatePath("/dashboard/tournaments");
  redirect("/dashboard/tournaments");
}
