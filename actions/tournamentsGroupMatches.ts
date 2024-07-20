"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addTournamentGroupMatch(
  prevState: unknown,
  formData: FormData
) {
  const data = Object.fromEntries(formData.entries());

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
  const data = Object.fromEntries(formData.entries());

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
