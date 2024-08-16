"use server";

import prisma from "@/lib/db";
import fs from "fs/promises";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import { ImageSchema } from "@/schemas";

const schema = z.object({
  name: z.string().min(2),
  flagUrl: ImageSchema.optional(),
});

export async function addTeam(prevState: unknown, formData: FormData) {
  const result = schema.safeParse(Object.fromEntries(formData.entries()));

  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  let flagUrlPath = "";
  if (data.flagUrl != null && data.flagUrl.size > 0) {
    flagUrlPath = `/teams/${crypto.randomUUID()}-${data.flagUrl.name}`;

    await fs.writeFile(
      `public${flagUrlPath}`,
      Buffer.from(await data.flagUrl.arrayBuffer())
    );
  }

  await prisma.team.create({
    data: {
      name: data.name.toString(),
      flagUrl: flagUrlPath,
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
  const result = schema.safeParse(Object.fromEntries(formData.entries()));

  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  const team = await prisma.team.findUnique({ where: { id } });

  if (team == null) return notFound();

  let flagUrlPath = team.flagUrl;
  if (data.flagUrl != null && data.flagUrl.size > 0) {
    if (team.flagUrl) await fs.unlink(`public${team.flagUrl}`);

    flagUrlPath = `/teams/${crypto.randomUUID()}-${data.flagUrl.name}`;

    await fs.writeFile(
      `public${flagUrlPath}`,
      Buffer.from(await data.flagUrl.arrayBuffer())
    );
  }

  await prisma.team.update({
    where: { id },
    data: {
      name: data.name.toString(),
      flagUrl: flagUrlPath,
    },
  });

  revalidatePath("/dashboard/teams");
  redirect("/dashboard/teams");
}
