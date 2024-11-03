"use server";

import prisma from "@/lib/db";
import fs from "fs/promises";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { TournamentSchema } from "@/schemas";
import { IsPopularOptions } from "@/types/enums";

export async function addTournament(prevState: unknown, formData: FormData) {
  const result = TournamentSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  const tournament = await prisma.tournament.findFirst({
    where: { name: data.name },
  });

  if (tournament) return { name: ["Tournament existed"] };

  let logoUrlPath = "";
  if (data.logoUrl != null && data.logoUrl.size > 0) {
    logoUrlPath = `/images/tournaments/${crypto.randomUUID()}-${
      data.logoUrl.name
    }`;

    await fs.writeFile(
      `public${logoUrlPath}`,
      new Uint8Array(Buffer.from(await data.logoUrl.arrayBuffer()))
    );
  }

  await prisma.tournament.create({
    data: {
      name: data.name.toString(),
      logoUrl: logoUrlPath,
      type: data.type.toString(),
      isPopular: data.isPopular === IsPopularOptions.Yes,
    },
  });

  revalidatePath("/dashboard/tournaments");
  redirect(`/dashboard/tournaments`);
}

export async function updateTournament(
  id: number,
  prevState: unknown,
  formData: FormData
) {
  const result = TournamentSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  const existedTournament = await prisma.tournament.findFirst({
    where: { AND: [{ name: data.name }, { id: { not: id } }] },
  });

  if (existedTournament) return { name: ["Tournament existed"] };

  const tournament = await prisma.tournament.findUnique({ where: { id } });

  if (tournament == null) return notFound();

  let logoUrlPath = tournament.logoUrl;
  if (data.logoUrl != null && data.logoUrl.size > 0) {
    if (tournament.logoUrl) await fs.unlink(`public${tournament.logoUrl}`);

    logoUrlPath = `/images/tournaments/${crypto.randomUUID()}-${
      data.logoUrl.name
    }`;

    await fs.writeFile(
      `public${logoUrlPath}`,
      new Uint8Array(Buffer.from(await data.logoUrl.arrayBuffer()))
    );
  }

  await prisma.tournament.update({
    where: { id },
    data: {
      name: data.name.toString(),
      logoUrl: logoUrlPath,
      type: data.type.toString(),
      isPopular: data.isPopular === IsPopularOptions.Yes,
    },
  });

  revalidatePath("/dashboard/tournaments");
  redirect(`/dashboard/tournaments`);
}

export async function updateTournamentPopularStatus(
  id: number,
  isPopular: boolean,
  searchParams: string
) {
  const currentTournament = await prisma.tournament.findUnique({
    where: { id },
  });

  if (currentTournament == null) return notFound();

  await prisma.tournament.update({
    where: { id },
    data: {
      isPopular: !isPopular,
    },
  });

  revalidatePath("/dashboard/tournaments");
  redirect(`/dashboard/tournaments${searchParams ? `?${searchParams}` : ""}`);
}
