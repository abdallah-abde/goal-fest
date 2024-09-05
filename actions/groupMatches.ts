"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { GroupMatchSchema } from "@/schemas";

export async function addTournamentGroupMatch(
  prevState: unknown,
  formData: FormData
) {
  const result = GroupMatchSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  await prisma.match.create({
    data: {
      homeTeamId: +data.homeTeamId,
      awayTeamId: +data.awayTeamId,
      homeGoals: data.homeGoals ? +data.homeGoals : null,
      awayGoals: data.awayGoals ? +data.awayGoals : null,
      date: data.date ? new Date(data.date.toString()) : null,
      groupId: +data.groupId,
      tournamentEditionId: +data.tournamentEditionId,
      round: data.round ? data.round.toString() : null,
    },
  });

  revalidatePath("/dashboard/matches");
  redirect("/dashboard/matches");
}

export async function updateTournamentGroupMatch(
  id: number,
  prevState: unknown,
  formData: FormData
) {
  const result = GroupMatchSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  const currentMatch = await prisma.match.findUnique({
    where: { id },
  });

  if (currentMatch == null) return notFound();

  await prisma.match.update({
    where: { id },
    data: {
      homeTeamId: +data.homeTeamId,
      awayTeamId: +data.awayTeamId,
      homeGoals: data.homeGoals ? +data.homeGoals : null,
      awayGoals: data.awayGoals ? +data.awayGoals : null,
      date: data.date ? new Date(data.date.toString()) : null,
      groupId: +data.groupId,
      tournamentEditionId: +data.tournamentEditionId,
      round: data.round ? data.round.toString() : null,
    },
  });

  revalidatePath("/dashboard/matches");
  redirect("/dashboard/matches");
}
