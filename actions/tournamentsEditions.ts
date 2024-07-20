"use server";

import prisma from "@/lib/db";
import fs from "fs/promises";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addTournamentEdition(
  prevState: unknown,
  formData: FormData
) {
  const data = Object.fromEntries(formData.entries());

  let imagePath = "";
  if (data.image !== null && data.image.size > 0) {
    imagePath = `/tournaments/${crypto.randomUUID()}-${data.image.name}`;

    await fs.writeFile(
      `public${imagePath}`,
      Buffer.from(await data.image.arrayBuffer())
    );
  }

  const hostingCountries = await prisma.country.findMany({
    where: {
      id: {
        in: formData.getAll("countries").map((a) => +a),
      },
    },
  });

  await prisma.tournamentEdition.create({
    data: {
      tournamentId: +data.tournamentId,
      year: +data.year,
      logoUrl: data.image.size > 0 ? imagePath : null,
      winnerId: data.winnerId ? +data.winnerId : null,
      hostingCountries: {
        connect: hostingCountries,
      },
    },
  });

  revalidatePath("/dashboard/editions");
  redirect("/dashboard/editions");
}

export async function updateTournamentEdition(
  id: number,
  prevState: unknown,
  formData: FormData
) {
  const data = Object.fromEntries(formData.entries());

  const tournamentEdition = await prisma.tournamentEdition.findUnique({
    where: { id },
  });

  if (tournamentEdition == null) return;

  let imagePath = tournamentEdition.logoUrl;
  if (data.image !== null && data.image.size > 0) {
    if (tournamentEdition.logoUrl)
      await fs.unlink(`public${tournamentEdition.logoUrl}`);

    imagePath = `/tournaments/${crypto.randomUUID()}-${data.image.name}`;

    await fs.writeFile(
      `public${imagePath}`,
      Buffer.from(await data.image.arrayBuffer())
    );
  }

  const hostingCountries = await prisma.country.findMany({
    where: {
      id: {
        in: formData.getAll("hostingCountries").map((a) => +a),
      },
    },
  });

  const currentTournamentEdition = await prisma.tournamentEdition.findUnique({
    where: { id },
    include: { hostingCountries: true },
  });

  await prisma.tournamentEdition.update({
    where: { id },
    data: {
      tournamentId: +data.tournamentId,
      year: +data.year,
      logoUrl: imagePath,
      winnerId: data.winnerId ? +data.winnerId : null,
      hostingCountries: {
        disconnect: currentTournamentEdition?.hostingCountries,
        connect: hostingCountries,
      },
    },
  });

  revalidatePath("/dashboard/editions");
  redirect("/dashboard/editions");
}
