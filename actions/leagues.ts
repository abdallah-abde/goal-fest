"use server";

import prisma from "@/lib/db";
import fs from "fs/promises";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { LeagueSchema } from "@/schemas";

export async function addLeague(prevState: unknown, formData: FormData) {
  const result = LeagueSchema.safeParse(Object.fromEntries(formData.entries()));

  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  //   const league = await prisma.league.findFirst({
  //     where: { name: data.name },
  //   });

  //   if (league) return { name: ["League existed"] };

  let logoUrlPath = "";
  if (data.logoUrl != null && data.logoUrl.size > 0) {
    logoUrlPath = `/images/tournaments/${crypto.randomUUID()}-${
      data.logoUrl.name
    }`;

    await fs.writeFile(
      `public${logoUrlPath}`,
      Buffer.from(await data.logoUrl.arrayBuffer())
    );
  }

  await prisma.league.create({
    data: {
      name: data.name.toString(),
      logoUrl: logoUrlPath,
      countryId: data.countryId ? +data.countryId : null,
      type: data.type.toString(),
    },
  });

  revalidatePath("/dashboard/leagues");
  redirect("/dashboard/leagues");
}

export async function updateLeague(
  id: number,
  prevState: unknown,
  formData: FormData
) {
  const result = LeagueSchema.safeParse(Object.fromEntries(formData.entries()));

  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  //   const existedLeague = await prisma.league.findFirst({
  //     where: { AND: [{ name: data.name }, { id: { not: id } }] },
  //   });

  //   if (existedLeague) return { name: ["League existed"] };

  const league = await prisma.league.findUnique({ where: { id } });

  if (league == null) return notFound();

  let logoUrlPath = league.logoUrl;
  if (data.logoUrl != null && data.logoUrl.size > 0) {
    if (league.logoUrl) await fs.unlink(`public${league.logoUrl}`);

    logoUrlPath = `/images/tournaments/${crypto.randomUUID()}-${
      data.logoUrl.name
    }`;

    await fs.writeFile(
      `public${logoUrlPath}`,
      Buffer.from(await data.logoUrl.arrayBuffer())
    );
  }

  await prisma.league.update({
    where: { id },
    data: {
      name: data.name.toString(),
      logoUrl: logoUrlPath,
      countryId: data.countryId ? +data.countryId : null,
      type: data.type.toString(),
    },
  });

  revalidatePath("/dashboard/leagues");
  redirect("/dashboard/leagues");
}

export async function updateLeaguePopularStatus(
  id: number,
  isPopular: boolean,
  searchParams: string
) {
  const currentLeague = await prisma.league.findUnique({
    where: { id },
  });

  if (currentLeague == null) return notFound();

  await prisma.league.update({
    where: { id },
    data: {
      isPopular,
    },
  });

  revalidatePath("/dashboard/leagues");
  redirect(`/dashboard/leagues${searchParams ? `?${searchParams}` : ""}`);
}
