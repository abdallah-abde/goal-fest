"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import {
  LeagueMatchSchema,
  MatchScoreSchema,
  MatchStatusSchema,
} from "@/schemas";
import { MatchStatusOptions } from "@/types/enums";

export async function addLeagueMatch(prevState: unknown, formData: FormData) {
  const result = LeagueMatchSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  const homeGoals = formData.get("homeGoals");
  const awayGoals = formData.get("awayGoals");

  if (data.homeTeamId === data.awayTeamId)
    return { awayTeamId: ["Home team & Away team can't be the same"] };

  await prisma.leagueMatch.create({
    data: {
      homeTeamId: +data.homeTeamId,
      awayTeamId: +data.awayTeamId,
      homeGoals: homeGoals ? +homeGoals : null,
      awayGoals: awayGoals ? +awayGoals : null,
      date: data.date ? new Date(data.date.toString()) : null,
      seasonId: +data.seasonId,
      round: data.round ? data.round.toString() : null,
      status: MatchStatusOptions.Scheduled,
      groupId: data.groupId ? +data.groupId : null,
    },
  });

  revalidatePath("/dashboard/league-matches");
  // redirect(`/dashboard/league-matches`);
}

export async function updateLeagueMatch(
  id: number,
  prevState: unknown,
  formData: FormData
) {
  const result = LeagueMatchSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  const currentMatch = await prisma.leagueMatch.findUnique({
    where: { id },
  });

  if (currentMatch == null) return notFound();

  const homeGoals = formData.get("homeGoals");
  const awayGoals = formData.get("awayGoals");

  if (data.homeTeamId === data.awayTeamId)
    return { awayTeamId: ["Home team & Away team can't be the same"] };

  await prisma.leagueMatch.update({
    where: { id },
    data: {
      homeTeamId: +data.homeTeamId,
      awayTeamId: +data.awayTeamId,
      homeGoals: homeGoals ? +homeGoals : null,
      awayGoals: awayGoals ? +awayGoals : null,
      date: data.date ? new Date(data.date.toString()) : null,
      seasonId: +data.seasonId,
      round: data.round ? data.round.toString() : null,
      groupId: data.groupId ? +data.groupId : null,
    },
  });

  revalidatePath("/dashboard/league-matches");
  // redirect(`/dashboard/league-matches`);
}

export async function updateLeagueMatchFeaturedStatus(
  id: number,
  isFeatured: boolean,
  searchParams: string
) {
  const currentMatch = await prisma.leagueMatch.findUnique({
    where: { id },
  });

  if (currentMatch == null) return notFound();

  await prisma.leagueMatch.update({
    where: { id },
    data: {
      isFeatured: !isFeatured,
    },
  });

  revalidatePath("/dashboard/league-matches");
  redirect(
    `/dashboard/league-matches${searchParams ? `?${searchParams}` : ""}`
  );
}

export async function updateLeagueMatchScore(
  args: { id: number; searchParams: string },
  prevState: unknown,
  formData: FormData
) {
  const { id, searchParams } = args;

  const result = MatchScoreSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  console.log(result.success);

  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const currentMatch = await prisma.leagueMatch.findUnique({
    where: { id },
  });

  if (currentMatch == null) return notFound();

  const homeGoals = formData.get("homeGoals");
  const awayGoals = formData.get("awayGoals");

  await prisma.leagueMatch.update({
    where: { id },
    data: {
      homeGoals: homeGoals ? +homeGoals : null,
      awayGoals: awayGoals ? +awayGoals : null,
    },
  });

  revalidatePath("/dashboard/league-matches");
  redirect(
    `/dashboard/league-matches${searchParams ? `?${searchParams}` : ""}`
  );
}

export async function updateLeagueMatchStatus(
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

  const currentMatch = await prisma.leagueMatch.findUnique({
    where: { id },
  });

  if (currentMatch == null) return notFound();

  await prisma.leagueMatch.update({
    where: { id },
    data: {
      status: data.status,
    },
  });

  revalidatePath("/dashboard/league-matches");
  redirect(
    `/dashboard/league-matches${searchParams ? `?${searchParams}` : ""}`
  );
}
