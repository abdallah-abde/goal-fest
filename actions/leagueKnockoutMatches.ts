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
import { ZodError } from "zod";

interface Fields {
  seasonId: string;
  date?: string | null;
  homeTeamId?: string | null;
  awayTeamId?: string | null;
  homeGoals?: string | null;
  awayGoals?: string | null;
  homeExtraTimeGoals?: string | null;
  awayExtraTimeGoals?: string | null;
  homePenaltyGoals?: string | null;
  awayPenaltyGoals?: string | null;
  round?: string | null;
  homeTeamPlacehlder?: string | null;
  awayTeamPlacehlder?: string | null;
}

interface ReturnType {
  errors: Record<keyof Fields, string | undefined> | undefined;
  success: boolean;
  customError?: string | null;
}

export async function addLeagueKnockoutMatch(
  prevState: ReturnType,
  formData: FormData
): Promise<ReturnType> {
  try {
    const result = LeagueKnockoutMatchSchema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (result.success === false) {
      const errors: Record<keyof Fields, string | undefined> = {
        seasonId: result.error.formErrors.fieldErrors.seasonId?.[0],
        date: result.error.formErrors.fieldErrors.date?.[0],
        homeTeamId: result.error.formErrors.fieldErrors.homeTeamId?.[0],
        awayTeamId: result.error.formErrors.fieldErrors.awayTeamId?.[0],
        homeGoals: result.error.formErrors.fieldErrors.homeGoals?.[0],
        awayGoals: result.error.formErrors.fieldErrors.awayGoals?.[0],
        homeExtraTimeGoals:
          result.error.formErrors.fieldErrors.homeExtraTimeGoals?.[0],
        awayExtraTimeGoals:
          result.error.formErrors.fieldErrors.awayExtraTimeGoals?.[0],
        homePenaltyGoals:
          result.error.formErrors.fieldErrors.homePenaltyGoals?.[0],
        awayPenaltyGoals:
          result.error.formErrors.fieldErrors.awayPenaltyGoals?.[0],
        homeTeamPlacehlder:
          result.error.formErrors.fieldErrors.homeTeamPlacehlder?.[0],
        awayTeamPlacehlder:
          result.error.formErrors.fieldErrors.awayTeamPlacehlder?.[0],
        round: result.error.formErrors.fieldErrors.round?.[0],
      };

      return { errors, success: false, customError: null };
    }

    const data = result.data;

    const homeGoals = formData.get("homeGoals");
    const awayGoals = formData.get("awayGoals");
    const homeExtraTimeGoals = formData.get("homeExtraTimeGoals");
    const awayExtraTimeGoals = formData.get("awayExtraTimeGoals");
    const homePenaltyGoals = formData.get("homePenaltyGoals");
    const awayPenaltyGoals = formData.get("awayPenaltyGoals");

    if (
      data.homeTeamId &&
      data.awayTeamId &&
      data.homeTeamId === data.awayTeamId
    ) {
      return {
        errors: undefined,
        success: false,
        customError: "Home team and away team cannot be the same!",
      };
    }

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
    return { errors: undefined, success: true, customError: null };
  } catch (error) {
    const zodError = error as ZodError;
    const errorMap = zodError.flatten().fieldErrors;
    return {
      success: false,
      customError: null,
      errors: {
        seasonId: errorMap["seasonId"]?.[0],
        date: errorMap["date"]?.[0],
        homeTeamId: errorMap["homeTeamId"]?.[0],
        awayTeamId: errorMap["awayTeamId"]?.[0],
        homeGoals: errorMap["homeGoals"]?.[0],
        awayGoals: errorMap["awayGoals"]?.[0],
        homeExtraTimeGoals: errorMap["homeExtraTimeGoals"]?.[0],
        awayExtraTimeGoals: errorMap["awayExtraTimeGoals"]?.[0],
        homePenaltyGoals: errorMap["homePenaltyGoals"]?.[0],
        awayPenaltyGoals: errorMap["awayPenaltyGoals"]?.[0],
        homeTeamPlacehlder: errorMap["homeTeamPlacehlder"]?.[0],
        awayTeamPlacehlder: errorMap["awayTeamPlacehlder"]?.[0],
        round: errorMap["round"]?.[0],
      },
    };
  }
}

export async function updateLeagueKnockoutMatch(
  id: number,
  prevState: ReturnType,
  formData: FormData
): Promise<ReturnType> {
  try {
    const result = LeagueKnockoutMatchSchema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (result.success === false) {
      const errors: Record<keyof Fields, string | undefined> = {
        seasonId: result.error.formErrors.fieldErrors.seasonId?.[0],
        date: result.error.formErrors.fieldErrors.date?.[0],
        homeTeamId: result.error.formErrors.fieldErrors.homeTeamId?.[0],
        awayTeamId: result.error.formErrors.fieldErrors.awayTeamId?.[0],
        homeGoals: result.error.formErrors.fieldErrors.homeGoals?.[0],
        awayGoals: result.error.formErrors.fieldErrors.awayGoals?.[0],
        homeExtraTimeGoals:
          result.error.formErrors.fieldErrors.homeExtraTimeGoals?.[0],
        awayExtraTimeGoals:
          result.error.formErrors.fieldErrors.awayExtraTimeGoals?.[0],
        homePenaltyGoals:
          result.error.formErrors.fieldErrors.homePenaltyGoals?.[0],
        awayPenaltyGoals:
          result.error.formErrors.fieldErrors.awayPenaltyGoals?.[0],
        homeTeamPlacehlder:
          result.error.formErrors.fieldErrors.homeTeamPlacehlder?.[0],
        awayTeamPlacehlder:
          result.error.formErrors.fieldErrors.awayTeamPlacehlder?.[0],
        round: result.error.formErrors.fieldErrors.round?.[0],
      };

      return { errors, success: false, customError: null };
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

    if (
      data.homeTeamId &&
      data.awayTeamId &&
      data.homeTeamId === data.awayTeamId
    ) {
      return {
        errors: undefined,
        success: false,
        customError: "Home team and away team cannot be the same!",
      };
    }

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
    return { errors: undefined, success: true, customError: null };
  } catch (error) {
    const zodError = error as ZodError;
    const errorMap = zodError.flatten().fieldErrors;
    return {
      success: false,
      customError: null,
      errors: {
        seasonId: errorMap["seasonId"]?.[0],
        date: errorMap["date"]?.[0],
        homeTeamId: errorMap["homeTeamId"]?.[0],
        awayTeamId: errorMap["awayTeamId"]?.[0],
        homeGoals: errorMap["homeGoals"]?.[0],
        awayGoals: errorMap["awayGoals"]?.[0],
        homeExtraTimeGoals: errorMap["homeExtraTimeGoals"]?.[0],
        awayExtraTimeGoals: errorMap["awayExtraTimeGoals"]?.[0],
        homePenaltyGoals: errorMap["homePenaltyGoals"]?.[0],
        awayPenaltyGoals: errorMap["awayPenaltyGoals"]?.[0],
        homeTeamPlacehlder: errorMap["homeTeamPlacehlder"]?.[0],
        awayTeamPlacehlder: errorMap["awayTeamPlacehlder"]?.[0],
        round: errorMap["round"]?.[0],
      },
    };
  }
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
