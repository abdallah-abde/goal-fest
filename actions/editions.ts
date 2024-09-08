"use server";

import prisma from "@/lib/db";
import fs from "fs/promises";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { EditionSchema } from "@/schemas";

export async function addTournamentEdition(
  prevState: unknown,
  formData: FormData
) {
  const result = EditionSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  const edition = await prisma.tournamentEdition.findFirst({
    where: { AND: [{ year: data.year }, { tournamentId: data.tournamentId }] },
  });

  if (edition) return { year: ["Edition existed"] };

  let logoUrlPath = "";
  if (data.logoUrl != null && data.logoUrl.size > 0) {
    logoUrlPath = `/tournaments/${crypto.randomUUID()}-${data.logoUrl.name}`;

    await fs.writeFile(
      `public${logoUrlPath}`,
      Buffer.from(await data.logoUrl.arrayBuffer())
    );
  }

  const hostingCountries = await prisma.country.findMany({
    where: {
      id: {
        in: formData
          .getAll("hostingCountries")
          .toString()
          .split(",")
          .map((a) => +a),
      },
    },
  });

  const ts = await prisma.team.findMany({
    where: {
      id: {
        in: formData
          .getAll("teams")
          .toString()
          .split(",")
          .map((a) => +a),
      },
    },
  });

  await prisma.tournamentEdition.create({
    data: {
      tournamentId: +data.tournamentId,
      year: +data.year,
      yearAsString: data.year.toString(),
      logoUrl: logoUrlPath,
      winnerId: data.winnerId ? +data.winnerId : null,
      titleHolderId: data.titleHolderId ? +data.titleHolderId : null,
      hostingCountries: {
        connect: hostingCountries,
      },
      teams: {
        connect: ts,
      },
      currentStage: "Groups Stage",
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
  const result = EditionSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  const existedEdition = await prisma.tournamentEdition.findFirst({
    where: {
      AND: [
        { year: data.year },
        { tournamentId: data.tournamentId },
        { id: { not: id } },
      ],
    },
  });

  if (existedEdition) return { year: ["Edition existed"] };

  const currentTournamentEdition = await prisma.tournamentEdition.findUnique({
    where: { id },
    include: { hostingCountries: true, teams: true },
  });

  if (currentTournamentEdition == null) return notFound();

  let logoUrlPath = currentTournamentEdition.logoUrl;
  if (data.logoUrl != null && data.logoUrl.size > 0) {
    if (currentTournamentEdition.logoUrl)
      await fs.unlink(`public${currentTournamentEdition.logoUrl}`);

    logoUrlPath = `/tournaments/${crypto.randomUUID()}-${data.logoUrl.name}`;

    await fs.writeFile(
      `public${logoUrlPath}`,
      Buffer.from(await data.logoUrl.arrayBuffer())
    );
  }

  const hostingCountries = await prisma.country.findMany({
    where: {
      id: {
        in: formData
          .getAll("hostingCountries")
          .toString()
          .split(",")
          .map((a) => +a),
      },
    },
  });

  const ts = await prisma.team.findMany({
    where: {
      id: {
        in: formData
          .getAll("teams")
          .toString()
          .split(",")
          .map((a) => +a),
      },
    },
  });

  await prisma.tournamentEdition.update({
    where: { id },
    data: {
      tournamentId: +data.tournamentId,
      year: +data.year,
      yearAsString: data.year.toString(),
      logoUrl: logoUrlPath,
      winnerId: data.winnerId ? +data.winnerId : null,
      titleHolderId: data.titleHolderId ? +data.titleHolderId : null,
      hostingCountries: {
        disconnect: currentTournamentEdition?.hostingCountries,
        connect: hostingCountries,
      },
      teams: {
        disconnect: currentTournamentEdition?.teams,
        connect: ts,
      },
    },
  });

  revalidatePath("/dashboard/editions");
  redirect("/dashboard/editions");
}
