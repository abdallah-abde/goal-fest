"use server";

import prisma from "@/lib/db";
import fs from "fs/promises";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addTeam(prevState: unknown, formData: FormData) {
  const data = Object.fromEntries(formData.entries());

  let imagePath = "";
  if (data.image !== null && data.image.size > 0) {
    imagePath = `/teams/${crypto.randomUUID()}-${data.image.name}`;

    await fs.writeFile(
      `public${imagePath}`,
      Buffer.from(await data.image.arrayBuffer())
    );
  }

  await prisma.team.create({
    data: {
      name: data.name.toString(),
      flagUrl: data.image.size > 0 ? imagePath : null,
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
  const data = Object.fromEntries(formData.entries());

  const team = await prisma.team.findUnique({ where: { id } });

  if (team == null) return;

  let imagePath = team.flagUrl;
  if (data.image !== null && data.image.size > 0) {
    if (team.flagUrl) await fs.unlink(`public${team.flagUrl}`);

    imagePath = `/teams/${crypto.randomUUID()}-${data.image.name}`;

    await fs.writeFile(
      `public${imagePath}`,
      Buffer.from(await data.image.arrayBuffer())
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
