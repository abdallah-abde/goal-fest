"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { knockoutMatchSchema } from "@/schemas";

export async function addTournamentKnockoutMatch(
  prevState: unknown,
  formData: FormData
) {
  const result = knockoutMatchSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  await prisma.knockoutMatch.create({
    data: {
      homeTeamId: data.homeTeamId ? +data.homeTeamId : null,
      awayTeamId: data.awayTeamId ? +data.awayTeamId : null,
      homeGoals: data.homeGoals ? +data.homeGoals : null,
      awayGoals: data.awayGoals ? +data.awayGoals : null,
      homeExtraTimeGoals: data.homeExtraTimeGoals
        ? +data.homeExtraTimeGoals
        : null,
      awayExtraTimeGoals: data.awayExtraTimeGoals
        ? +data.awayExtraTimeGoals
        : null,
      homePenaltyGoals: data.homePenaltyGoals ? +data.homePenaltyGoals : null,
      awayPenaltyGoals: data.awayPenaltyGoals ? +data.awayPenaltyGoals : null,
      date: data.date ? new Date(data.date.toString()) : null,
      tournamentEditionId: +data.tournamentEditionId,
      round: data.round || null,
      homeTeamPlacehlder: data.homeTeamPlacehlder
        ? data.homeTeamPlacehlder.toString()
        : null,
      awayTeamPlacehlder: data.awayTeamPlacehlder
        ? data.awayTeamPlacehlder.toString()
        : null,
    },
  });

  revalidatePath("/dashboard/knockout-matches");
  redirect("/dashboard/knockout-matches");
}

export async function updateTournamentKnockoutMatch(
  id: number,
  prevState: unknown,
  formData: FormData
) {
  const result = knockoutMatchSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  const currentMatch = await prisma.knockoutMatch.findUnique({
    where: { id },
  });

  if (currentMatch == null) return notFound();

  await prisma.knockoutMatch.update({
    where: { id },
    data: {
      homeTeamId: data.homeTeamId ? +data.homeTeamId : null,
      awayTeamId: data.awayTeamId ? +data.awayTeamId : null,
      homeGoals: data.homeGoals ? +data.homeGoals : null,
      awayGoals: data.awayGoals ? +data.awayGoals : null,
      homeExtraTimeGoals: data.homeExtraTimeGoals
        ? +data.homeExtraTimeGoals
        : null,
      awayExtraTimeGoals: data.awayExtraTimeGoals
        ? +data.awayExtraTimeGoals
        : null,
      homePenaltyGoals: data.homePenaltyGoals ? +data.homePenaltyGoals : null,
      awayPenaltyGoals: data.awayPenaltyGoals ? +data.awayPenaltyGoals : null,
      date: data.date ? new Date(data.date.toString()) : null,
      tournamentEditionId: +data.tournamentEditionId,
      round: data.round || null,
      homeTeamPlacehlder: data.homeTeamPlacehlder
        ? data.homeTeamPlacehlder.toString()
        : null,
      awayTeamPlacehlder: data.awayTeamPlacehlder
        ? data.awayTeamPlacehlder.toString()
        : null,
    },
  });

  revalidatePath("/dashboard/knockout-matches");
  redirect("/dashboard/knockout-matches");
}
