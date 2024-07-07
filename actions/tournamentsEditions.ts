"use server";

import prisma from "@/lib/db";
import fs from "fs/promises";

export async function addTournamentEdition(
  prevState: unknown,
  formData: FormData
) {
  const data = Object.fromEntries(formData.entries());
  console.log(data);
  const imagePath = `/tournaments/${crypto.randomUUID()}-${data.image.name}`;
  console.log(imagePath);

  await fs.writeFile(
    `public${imagePath}`,
    Buffer.from(await data.image.arrayBuffer())
  );

  await prisma.tournamentEdition.create({
    data: {
      tournamentId: parseInt(data.tournamentId),
      year: parseInt(data.year),
      logoUrl: imagePath,
    },
  });
}

export async function updateTournamentEdition(
  id: number,
  prevState: unknown,
  formData: FormData
) {
  const data = Object.fromEntries(formData.entries());
  console.log(data);

  const tournamentEdition = await prisma.tournamentEdition.findUnique({
    where: { id },
  });

  if (tournamentEdition == null) return;

  let imagePath = tournamentEdition.logoUrl;
  if (data.image != null && data.image.size > 0) {
    await fs.unlink(`public${tournamentEdition.logoUrl}`);
    imagePath = `/tournaments/${crypto.randomUUID()}-${data.image.name}`;
    await fs.writeFile(
      `public${imagePath}`,
      Buffer.from(await data.image.arrayBuffer())
    );
  }

  await prisma.tournamentEdition.update({
    where: { id },
    data: {
      tournamentId: parseInt(data.tournamentId),
      year: parseInt(data.year),
      logoUrl: imagePath,
    },
  });
}
