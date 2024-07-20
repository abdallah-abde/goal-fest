"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addTournamentGroup(
  prevState: unknown,
  formData: FormData
) {
  const data = Object.fromEntries(formData.entries());

  const ts = await prisma.team.findMany({
    where: {
      id: {
        in: formData.getAll("teams").map((a) => +a),
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
  redirect("/dashboard/groups");
}

export async function updateTournamentGroup(
  id: number,
  prevState: unknown,
  formData: FormData
) {
  const data = Object.fromEntries(formData.entries());

  const ts = await prisma.team.findMany({
    where: {
      id: {
        in: formData.getAll("teams").map((a) => +a),
      },
    },
  });

  const currentGroup = await prisma.group.findUnique({
    where: { id },
    include: { teams: true },
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
  redirect("/dashboard/groups");
}
