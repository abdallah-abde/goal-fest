"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import {
  LeagueKnockoutMatchSchema,
  knockoutMatchScoreSchema,
  MatchStatusSchema,
} from "@/schemas";
import { MatchStatusOptions } from "@/types/enums";

export async function addLeagueKnockoutMatch(
  prevState: unknown,
  formData: FormData
) {
  const result = LeagueKnockoutMatchSchema.safeParse(
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

  await prisma.leagueKnockoutMatch.create({
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
      seasonId: +data.seasonId,
      round: data.round || null,
      homeTeamPlacehlder: data.homeTeamPlacehlder
        ? data.homeTeamPlacehlder.toString()
        : null,
      awayTeamPlacehlder: data.awayTeamPlacehlder
        ? data.awayTeamPlacehlder.toString()
        : null,
      status: MatchStatusOptions.Scheduled,
    },
  });

  revalidatePath("/dashboard/league-knockout-matches");
  redirect(`/dashboard/league-knockout-matches`);
}

export async function updateLeagueKnockoutMatch(
  id: number,
  prevState: unknown,
  formData: FormData
) {
  const result = LeagueKnockoutMatchSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  const currentMatch = await prisma.leagueKnockoutMatch.findUnique({
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

  await prisma.leagueKnockoutMatch.update({
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
      seasonId: +data.seasonId,
      round: data.round || null,
      homeTeamPlacehlder: data.homeTeamPlacehlder
        ? data.homeTeamPlacehlder.toString()
        : null,
      awayTeamPlacehlder: data.awayTeamPlacehlder
        ? data.awayTeamPlacehlder.toString()
        : null,
    },
  });

  revalidatePath("/dashboard/league-knockout-matches");
  redirect(`/dashboard/league-knockout-matches`);
}

export async function updateLeagueKnockoutMatchFeaturedStatus(
  id: number,
  isFeatured: boolean,
  searchParams: string
) {
  const currentMatch = await prisma.leagueKnockoutMatch.findUnique({
    where: { id },
  });

  if (currentMatch == null) return notFound();

  await prisma.leagueKnockoutMatch.update({
    where: { id },
    data: {
      isFeatured: !isFeatured,
    },
  });

  revalidatePath("/dashboard/league-knockout-matches");
  redirect(
    `/dashboard/league-knockout-matches${
      searchParams ? `?${searchParams}` : ""
    }`
  );
}

export async function updateLeagueKnockoutMatchScore(
  args: { id: number; searchParams: string },
  prevState: unknown,
  formData: FormData
) {
  const { id, searchParams } = args;

  const result = knockoutMatchScoreSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const currentMatch = await prisma.leagueKnockoutMatch.findUnique({
    where: { id },
  });

  if (currentMatch == null) return notFound();

  const homeGoals = formData.get("homeGoals");
  const awayGoals = formData.get("awayGoals");
  const homeExtraTimeGoals = formData.get("homeExtraTimeGoals");
  const awayExtraTimeGoals = formData.get("awayExtraTimeGoals");
  const homePenaltyGoals = formData.get("homePenaltyGoals");
  const awayPenaltyGoals = formData.get("awayPenaltyGoals");

  await prisma.leagueKnockoutMatch.update({
    where: { id },
    data: {
      homeGoals: homeGoals ? +homeGoals : null,
      awayGoals: awayGoals ? +awayGoals : null,
      homeExtraTimeGoals: homeExtraTimeGoals ? +homeExtraTimeGoals : null,
      awayExtraTimeGoals: awayExtraTimeGoals ? +awayExtraTimeGoals : null,
      homePenaltyGoals: homePenaltyGoals ? +homePenaltyGoals : null,
      awayPenaltyGoals: awayPenaltyGoals ? +awayPenaltyGoals : null,
    },
  });

  revalidatePath("/dashboard/league-knockout-matches");
  redirect(
    `/dashboard/league-knockout-matches${
      searchParams ? `?${searchParams}` : ""
    }`
  );
}

export async function updateLeagueKnockoutMatchStatus(
  args: { id: number; searchParams: string },
  prevState: unknown,
  formData: FormData
) {
  const { id, searchParams } = args;

  const result = MatchStatusSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  const currentMatch = await prisma.leagueKnockoutMatch.findUnique({
    where: { id },
  });

  if (currentMatch == null) return notFound();

  await prisma.leagueKnockoutMatch.update({
    where: { id },
    data: {
      status: data.status,
    },
  });

  revalidatePath("/dashboard/league-knockout-matches");
  redirect(
    `/dashboard/league-knockout-matches${
      searchParams ? `?${searchParams}` : ""
    }`
  );
}
