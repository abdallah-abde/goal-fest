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

  const homeGoals = formData.get("homeGoals");
  const awayGoals = formData.get("awayGoals");
  const homeExtraTimeGoals = formData.get("homeExtraTimeGoals");
  const awayExtraTimeGoals = formData.get("awayExtraTimeGoals");
  const homePenaltyGoals = formData.get("homePenaltyGoals");
  const awayPenaltyGoals = formData.get("awayPenaltyGoals");

  if (data.homeTeamId && data.awayTeamId && data.homeTeamId === data.awayTeamId)
    return { awayTeamId: ["Home team & Away team can't be the same"] };

  await prisma.knockoutMatch.create({
    data: {
      homeTeamId: data.homeTeamId ? +data.homeTeamId : null,
      awayTeamId: data.awayTeamId ? +data.awayTeamId : null,
      homeGoals: homeGoals ? +homeGoals : null,
      awayGoals: awayGoals ? +awayGoals : null,
      homeExtraTimeGoals: homeExtraTimeGoals ? +homeExtraTimeGoals : null,
      awayExtraTimeGoals: awayExtraTimeGoals ? +awayExtraTimeGoals : null,
      homePenaltyGoals: homePenaltyGoals ? +homePenaltyGoals : null,
      awayPenaltyGoals: awayPenaltyGoals ? +awayPenaltyGoals : null,
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

  const homeGoals = formData.get("homeGoals");
  const awayGoals = formData.get("awayGoals");
  const homeExtraTimeGoals = formData.get("homeExtraTimeGoals");
  const awayExtraTimeGoals = formData.get("awayExtraTimeGoals");
  const homePenaltyGoals = formData.get("homePenaltyGoals");
  const awayPenaltyGoals = formData.get("awayPenaltyGoals");

  if (data.homeTeamId && data.awayTeamId && data.homeTeamId === data.awayTeamId)
    return { awayTeamId: ["Home team & Away team can't be the same"] };

  await prisma.knockoutMatch.update({
    where: { id },
    data: {
      homeTeamId: data.homeTeamId ? +data.homeTeamId : null,
      awayTeamId: data.awayTeamId ? +data.awayTeamId : null,
      homeGoals: homeGoals ? +homeGoals : null,
      awayGoals: awayGoals ? +awayGoals : null,
      homeExtraTimeGoals: homeExtraTimeGoals ? +homeExtraTimeGoals : null,
      awayExtraTimeGoals: awayExtraTimeGoals ? +awayExtraTimeGoals : null,
      homePenaltyGoals: homePenaltyGoals ? +homePenaltyGoals : null,
      awayPenaltyGoals: awayPenaltyGoals ? +awayPenaltyGoals : null,
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
