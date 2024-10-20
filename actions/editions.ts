"use server";

import prisma from "@/lib/db";
import fs from "fs/promises";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { EditionSchema, CurrentStageSchema } from "@/schemas";
import { TournamentStages } from "@/types/enums";
import { generateSlug } from "@/lib/generateSlug";

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

  if (data.endYear < data.startYear)
    return { startYear: ["Start Year must be equal or less than End Year"] };

  const edition = await prisma.tournamentEdition.findFirst({
    where: {
      AND: [
        { startYear: data.startYear },
        { endYear: data.endYear },
        { tournamentId: data.tournamentId },
      ],
    },
  });

  if (edition) return { startYear: ["Edition existed"] };

  const tournament = await prisma.tournament.findUnique({
    where: { id: +data.tournamentId },
  });

  if (!tournament) return { tournamentId: ["No Tournament Found"] };

  let slug = generateSlug(tournament.name.toLowerCase().trim());

  let exists = await prisma.tournamentEdition.findUnique({ where: { slug } });
  while (exists) {
    slug = generateSlug(tournament.name.toLowerCase().trim()); // Generate a new slug if the one exists
    exists = await prisma.tournamentEdition.findUnique({ where: { slug } });
  }

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
      startYear: +data.startYear,
      endYear: +data.endYear,
      year:
        data.startYear === data.endYear
          ? data.startYear.toString()
          : data.startYear.toString() + "-" + data.endYear.toString(),
      logoUrl: logoUrlPath,
      winnerId: data.winnerId ? +data.winnerId : null,
      titleHolderId: data.titleHolderId ? +data.titleHolderId : null,
      hostingCountries: {
        connect: hostingCountries,
      },
      teams: {
        connect: ts,
      },
      currentStage: TournamentStages.GroupsStage,
      slug,
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
        { startYear: data.startYear },
        { endYear: data.endYear },
        { tournamentId: data.tournamentId },
        { id: { not: id } },
      ],
    },
  });

  if (existedEdition) return { startYear: ["Edition existed"] };

  const currentTournamentEdition = await prisma.tournamentEdition.findUnique({
    where: { id },
    include: { hostingCountries: true, teams: true },
  });

  if (currentTournamentEdition == null) return notFound();

  let logoUrlPath = currentTournamentEdition.logoUrl;
  if (data.logoUrl != null && data.logoUrl.size > 0) {
    if (currentTournamentEdition.logoUrl)
      await fs.unlink(`public${currentTournamentEdition.logoUrl}`);

    logoUrlPath = `/images/tournaments/${crypto.randomUUID()}-${
      data.logoUrl.name
    }`;

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
      startYear: +data.startYear,
      endYear: +data.endYear,
      year:
        data.startYear === data.endYear
          ? data.startYear.toString()
          : data.startYear.toString() + "-" + data.endYear.toString(),
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

export async function updateTournamentEditionCurrentStage(
  args: { id: number; searchParams: string },
  prevState: unknown,
  formData: FormData
) {
  const { id, searchParams } = args;

  const result = CurrentStageSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  const currentTournamentEdition = await prisma.tournamentEdition.findUnique({
    where: { id },
    include: { hostingCountries: true, teams: true },
  });

  if (currentTournamentEdition == null) return notFound();

  await prisma.tournamentEdition.update({
    where: { id },
    data: {
      currentStage: data.currentStage,
    },
  });

  revalidatePath("/dashboard/editions");
  redirect(`/dashboard/editions${searchParams ? `?${searchParams}` : ""}`);
}
