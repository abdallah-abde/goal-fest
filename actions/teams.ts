"use server";

import prisma from "@/lib/db";
import fs from "fs/promises";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";

const fileSchema = z.instanceof(File, { message: "Required" });

const imageSchema = fileSchema.refine(
  (file) => file.size === 0 || file.type.startsWith("image/")
);

const addSchema = z.object({
  name: z.string().min(2),
  flagUrl: imageSchema.optional(),
});

export async function addTeam(prevState: unknown, formData: FormData) {
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()));

  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  let imagePath = "";
  if (data.flagUrl != null && data.flagUrl.size > 0) {
    imagePath = `/teams/${crypto.randomUUID()}-${data.flagUrl.name}`;

    await fs.writeFile(
      `public${imagePath}`,
      Buffer.from(await data.flagUrl.arrayBuffer())
    );
  }

  await prisma.team.create({
    data: {
      name: data.name.toString(),
      flagUrl: imagePath,
    },
  });

  revalidatePath("/dashboard/teams");
  redirect("/dashboard/teams");
}

export async function updateTeam(
  id: number,
  prevState: unknown,
  formData: FormData
) {
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()));

  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  const team = await prisma.team.findUnique({ where: { id } });

  if (team == null) return notFound();

  let imagePath = team.flagUrl;
  if (data.flagUrl != null && data.flagUrl.size > 0) {
    if (team.flagUrl) await fs.unlink(`public${team.flagUrl}`);

    imagePath = `/teams/${crypto.randomUUID()}-${data.flagUrl.name}`;

    await fs.writeFile(
      `public${imagePath}`,
      Buffer.from(await data.flagUrl.arrayBuffer())
    );
  }

  await prisma.team.update({
    where: { id },
    data: {
      name: data.name.toString(),
      flagUrl: imagePath,
    },
  });

  revalidatePath("/dashboard/teams");
  redirect("/dashboard/teams");
}
