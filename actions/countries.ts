"use server";

import prisma from "@/lib/db";
import fs from "fs/promises";

export async function addCountry(prevState: unknown, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const imagePath = `/countries/${crypto.randomUUID()}-${data.image.name}`;

  await fs.writeFile(
    `public${imagePath}`,
    Buffer.from(await data.image.arrayBuffer())
  );

  await prisma.country.create({
    data: {
      name: data.name,
      flagUrl: imagePath,
    },
  });
}

export async function updateCountry(
  id: number,
  prevState: unknown,
  formData: FormData
) {
  const data = Object.fromEntries(formData.entries());

  const country = await prisma.country.findUnique({ where: { id } });

  if (country == null) return;

  let imagePath = country.flagUrl;
  if (data.image != null && data.image.size > 0) {
    await fs.unlink(`public${country.flagUrl}`);
    imagePath = `/countries/${crypto.randomUUID()}-${data.image.name}`;
    await fs.writeFile(
      `public${imagePath}`,
      Buffer.from(await data.image.arrayBuffer())
    );
  }

  await prisma.country.update({
    where: { id },
    data: {
      name: data.name,
      flagUrl: imagePath,
    },
  });
}
