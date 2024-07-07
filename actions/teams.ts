"use server";

import prisma from "@/lib/db";
import fs from "fs/promises";

export async function addTeam(prevState: unknown, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const imagePath = `/teams/${crypto.randomUUID()}-${data.image.name}`;

  await fs.writeFile(
    `public${imagePath}`,
    Buffer.from(await data.image.arrayBuffer())
  );

  await prisma.team.create({
    data: {
      name: data.name,
      flagUrl: imagePath,
    },
  });
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
  if (data.image != null && data.image.size > 0) {
    await fs.unlink(`public${team.flagUrl}`);
    imagePath = `/teams/${crypto.randomUUID()}-${data.image.name}`;
    await fs.writeFile(
      `public${imagePath}`,
      Buffer.from(await data.image.arrayBuffer())
    );
  }

  await prisma.team.update({
    where: { id },
    data: {
      name: data.name,
      flagUrl: imagePath,
    },
  });
}
