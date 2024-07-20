"use server";

import prisma from "@/lib/db";
import fs from "fs/promises";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addTournament(prevState: unknown, formData: FormData) {
  const data = Object.fromEntries(formData.entries());

  let imagePath = "";
  if (data.image !== null && data.image.size > 0) {
    imagePath = `/tournaments/${crypto.randomUUID()}-${data.image.name}`;

    await fs.writeFile(
      `public${imagePath}`,
      Buffer.from(await data.image.arrayBuffer())
    );
  }

  await prisma.tournament.create({
    data: {
      name: data.name.toString(),
      logoUrl: data.image.size > 0 ? imagePath : null,
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
  const data = Object.fromEntries(formData.entries());

  const tournament = await prisma.tournament.findUnique({ where: { id } });

  if (tournament == null) return;

  let imagePath = tournament.logoUrl;
  if (data.image !== null && data.image.size > 0) {
    if (tournament.logoUrl) await fs.unlink(`public${tournament.logoUrl}`);

    imagePath = `/tournaments/${crypto.randomUUID()}-${data.image.name}`;

    await fs.writeFile(
      `public${imagePath}`,
      Buffer.from(await data.image.arrayBuffer())
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
