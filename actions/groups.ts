"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { GroupSchema } from "@/schemas";

export async function addTournamentGroup(
  args: { searchParams: string },
  prevState: unknown,
  formData: FormData
) {
  const { searchParams } = args;

  const result = GroupSchema.safeParse(Object.fromEntries(formData.entries()));

  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  const group = await prisma.group.findFirst({
    where: { name: data.name, tournamentEditionId: +data.tournamentEditionId },
  });

  if (group) return { name: ["Group existed"] };

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

  await prisma.group.create({
    data: {
      name: data.name.toString(),
      tournamentEditionId: +data.tournamentEditionId,
      teams: {
        connect: ts,
      },
    },
  });

  revalidatePath("/dashboard/groups");
  redirect(`/dashboard/groups${searchParams ? `?${searchParams}` : ""}`);
}

export async function updateTournamentGroup(
  args: { id: number; searchParams: string },
  prevState: unknown,
  formData: FormData
) {
  const { id, searchParams } = args;

  const result = GroupSchema.safeParse(Object.fromEntries(formData.entries()));

  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  const group = await prisma.group.findFirst({
    where: {
      AND: [
        { name: data.name, tournamentEditionId: +data.tournamentEditionId },
        { id: { not: id } },
      ],
    },
  });

  if (group) return { name: ["Group existed"] };

  const currentGroup = await prisma.group.findUnique({
    where: { id },
    include: { teams: true },
  });

  if (currentGroup == null) return notFound();

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

  await prisma.group.update({
    where: { id },
    data: {
      name: data.name.toString(),
      tournamentEditionId: +data.tournamentEditionId,
      teams: {
        disconnect: currentGroup?.teams,
        connect: ts,
      },
    },
  });

  revalidatePath("/dashboard/groups");
  redirect(`/dashboard/groups${searchParams ? `?${searchParams}` : ""}`);
}
