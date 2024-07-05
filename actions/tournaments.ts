"use server";

import prisma from "@/lib/db";
import fs from "fs/promises";

export async function addTournament(prevState: unknown, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  console.log(data);
  const imagePath = `/tournaments/${crypto.randomUUID()}-${data.image.name}`;
  console.log(imagePath);

  await fs.writeFile(
    `public${imagePath}`,
    Buffer.from(await data.image.arrayBuffer())
  );

  await prisma.tournament.create({
    data: {
      name: data.name,
      logoUrl: imagePath,
    },
  });
}

export async function updateTournament(
  id: number,
  prevState: unknown,
  formData: FormData
) {
  const data = Object.fromEntries(formData.entries());
  console.log(data);

  const tournament = await prisma.tournament.findUnique({ where: { id } });

  if (tournament == null) return;

  let imagePath = tournament.logoUrl;
  if (data.image != null && data.image.size > 0) {
    await fs.unlink(`public${tournament.logoUrl}`);
    imagePath = `/tournaments/${crypto.randomUUID()}-${data.image.name}`;
    await fs.writeFile(
      `public${imagePath}`,
      Buffer.from(await data.image.arrayBuffer())
    );
  }

  await prisma.tournament.update({
    where: { id },
    data: {
      name: data.name,
      logoUrl: imagePath,
    },
  });
}
