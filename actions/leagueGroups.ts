"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { LeagueGroupSchema } from "@/schemas";

export async function addLeagueGroup(prevState: unknown, formData: FormData) {
  const result = LeagueGroupSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  const group = await prisma.leagueGroup.findFirst({
    where: { name: data.name, seasonId: +data.seasonId },
  });

  if (group) return { name: ["Group existed"] };

  const ts = await prisma.leagueTeam.findMany({
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

  await prisma.leagueGroup.create({
    data: {
      name: data.name.toString(),
      seasonId: +data.seasonId,
      teams: {
        connect: ts,
      },
    },
  });

  revalidatePath("/dashboard/league-groups");
  redirect(`/dashboard/league-groups`);
}

export async function updateLeagueGroup(
  id: number,
  prevState: unknown,
  formData: FormData
) {
  const result = LeagueGroupSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  const group = await prisma.leagueGroup.findFirst({
    where: {
      AND: [{ name: data.name, seasonId: +data.seasonId }, { id: { not: id } }],
    },
  });

  if (group) return { name: ["Group existed"] };

  const currentGroup = await prisma.leagueGroup.findUnique({
    where: { id },
    include: { teams: true },
  });

  if (currentGroup == null) return notFound();

  const ts = await prisma.leagueTeam.findMany({
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

  await prisma.leagueGroup.update({
    where: { id },
    data: {
      name: data.name.toString(),
      seasonId: +data.seasonId,
      teams: {
        disconnect: currentGroup?.teams,
        connect: ts,
      },
    },
  });

  revalidatePath("/dashboard/league-groups");
  redirect(`/dashboard/league-groups`);
}
