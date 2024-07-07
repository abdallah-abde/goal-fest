"use server";

import prisma from "@/lib/db";

export async function addTournamentGroup(
  prevState: unknown,
  formData: FormData
) {
  const data = Object.fromEntries(formData.entries());

  await prisma.group.create({
    data: {
      name: data.name.toString(),
      tournamentEditionId: +data.tournamentEditionId,
    },
  });
}

export async function updateTournamentGroup(
  id: number,
  prevState: unknown,
  formData: FormData
) {
  const data = Object.fromEntries(formData.entries());

  await prisma.group.update({
    where: { id },
    data: {
      name: data.name.toString(),
      tournamentEditionId: +data.tournamentEditionId,
    },
  });
}
