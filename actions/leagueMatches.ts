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
import { ZodError } from "zod";

interface Fields {
  seasonId: string;
  groupId: string;
  date?: string | null;
  homeTeamId: string;
  awayTeamId: string;
  homeGoals?: string | null;
  awayGoals?: string | null;
  round?: string | null;
}

interface ReturnType {
  errors: Record<keyof Fields, string | undefined> | undefined;
  success: boolean;
  customError?: string | null;
}

export async function addLeagueMatch(
  prevState: ReturnType,
  formData: FormData
): Promise<ReturnType> {
  try {
    const result = LeagueMatchSchema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (result.success === false) {
      const errors: Record<keyof Fields, string | undefined> = {
        seasonId: result.error.formErrors.fieldErrors.seasonId?.[0],
        groupId: result.error.formErrors.fieldErrors.groupId?.[0],
        date: result.error.formErrors.fieldErrors.date?.[0],
        homeTeamId: result.error.formErrors.fieldErrors.homeTeamId?.[0],
        awayTeamId: result.error.formErrors.fieldErrors.awayTeamId?.[0],
        homeGoals: result.error.formErrors.fieldErrors.homeGoals?.[0],
        awayGoals: result.error.formErrors.fieldErrors.awayGoals?.[0],
        round: result.error.formErrors.fieldErrors.round?.[0],
      };

      return { errors, success: false, customError: null };
    }

    const data = result.data;

    const homeGoals = formData.get("homeGoals");
    const awayGoals = formData.get("awayGoals");

    if (data.homeTeamId === data.awayTeamId) {
      return {
        errors: undefined,
        success: false,
        customError: "Home team and away team cannot be the same!",
      };
    }

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
    return { errors: undefined, success: true, customError: null };
  } catch (error) {
    const zodError = error as ZodError;
    const errorMap = zodError.flatten().fieldErrors;
    return {
      success: false,
      customError: null,
      errors: {
        seasonId: errorMap["seasonId"]?.[0],
        groupId: errorMap["groupId"]?.[0],
        date: errorMap["date"]?.[0],
        homeTeamId: errorMap["homeTeamId"]?.[0],
        awayTeamId: errorMap["awayTeamId"]?.[0],
        homeGoals: errorMap["homeGoals"]?.[0],
        awayGoals: errorMap["awayGoals"]?.[0],
        round: errorMap["round"]?.[0],
      },
    };
  }
}

export async function updateLeagueMatch(
  id: number,
  prevState: ReturnType,
  formData: FormData
): Promise<ReturnType> {
  try {
    const result = LeagueMatchSchema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (result.success === false) {
      const errors: Record<keyof Fields, string | undefined> = {
        seasonId: result.error.formErrors.fieldErrors.seasonId?.[0],
        groupId: result.error.formErrors.fieldErrors.groupId?.[0],
        date: result.error.formErrors.fieldErrors.date?.[0],
        homeTeamId: result.error.formErrors.fieldErrors.homeTeamId?.[0],
        awayTeamId: result.error.formErrors.fieldErrors.awayTeamId?.[0],
        homeGoals: result.error.formErrors.fieldErrors.homeGoals?.[0],
        awayGoals: result.error.formErrors.fieldErrors.awayGoals?.[0],
        round: result.error.formErrors.fieldErrors.round?.[0],
      };

      return { errors, success: false, customError: null };
    }

    const data = result.data;

    const currentMatch = await prisma.leagueMatch.findUnique({
      where: { id },
    });

    if (currentMatch == null) return notFound();

    const homeGoals = formData.get("homeGoals");
    const awayGoals = formData.get("awayGoals");

    if (data.homeTeamId === data.awayTeamId) {
      return {
        errors: undefined,
        success: false,
        customError: "Home team and away team cannot be the same!",
      };
    }

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
    return { errors: undefined, success: true, customError: null };
  } catch (error) {
    const zodError = error as ZodError;
    const errorMap = zodError.flatten().fieldErrors;
    return {
      success: false,
      customError: null,
      errors: {
        seasonId: errorMap["seasonId"]?.[0],
        groupId: errorMap["groupId"]?.[0],
        date: errorMap["date"]?.[0],
        homeTeamId: errorMap["homeTeamId"]?.[0],
        awayTeamId: errorMap["awayTeamId"]?.[0],
        homeGoals: errorMap["homeGoals"]?.[0],
        awayGoals: errorMap["awayGoals"]?.[0],
        round: errorMap["round"]?.[0],
      },
    };
  }
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
