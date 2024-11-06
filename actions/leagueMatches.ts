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
import { z, ZodError, ZodIssueCode } from "zod";

interface Fields {
  seasonId: string;
  groupId: string;
  date?: string;
  homeTeamId: string;
  awayTeamId: string;
  homeGoals?: string;
  awayGoals?: string;
  round?: string;
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
        customError: "home team and away team cannot be the same!",
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
    // redirect(`/dashboard/league-matches`);
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

interface FormState {
  message: string;
  errors: Record<keyof Fields, string> | undefined;
  fieldValues: Fields;
}

export async function addLeagueMatch1(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const seasonId = formData.get("seasonId") as string;
  const groupId = formData.get("groupId") as string;
  const date = formData.get("date") as string;
  const homeTeamId = formData.get("homeTeamId") as string;
  const awayTeamId = formData.get("awayTeamId") as string;
  const homeGoals = formData.get("homeGoals") as string;
  const awayGoals = formData.get("awayGoals") as string;
  const round = formData.get("round") as string;

  console.log("Home Team Id", homeTeamId);
  console.log("away Team Id", awayTeamId);

  try {
    if (homeTeamId === awayTeamId) {
      return {
        message: "same team error",
        errors: undefined,
        fieldValues: {
          seasonId,
          groupId,
          date,
          homeTeamId,
          awayTeamId,
          homeGoals,
          awayGoals,
          round,
        },
      };
    }
    // Object.fromEntries(formData.entries())
    LeagueMatchSchema.safeParse({
      seasonId: +seasonId,
      groupId: groupId ? +groupId : null,
      date: date ? new Date(date) : null,
      homeTeamId: +homeTeamId,
      awayTeamId: +awayTeamId,
      homeGoals: homeGoals ? +homeGoals : null,
      awayGoals: awayGoals ? +awayGoals : null,
      round: round || null,
    });

    // if (!result.success) {
    //   return { error: "Invalid fields!" };
    // }

    // const { homeTeamId, awayTeamId, seasonId, date, round, groupId } =
    //   result.data;

    // console.log(result.data);

    // const homeGoals = formData.get("homeGoals");
    // const awayGoals = formData.get("awayGoals");

    // if (homeTeamId === awayTeamId)
    //   return { error: "Home team & Away team can't be the same" };

    await prisma.leagueMatch.create({
      data: {
        homeTeamId: +homeTeamId,
        awayTeamId: +awayTeamId,
        homeGoals: homeGoals ? +homeGoals : null,
        awayGoals: awayGoals ? +awayGoals : null,
        date: date ? new Date(date.toString()) : null,
        seasonId: +seasonId,
        round: round ? round.toString() : null,
        status: MatchStatusOptions.Scheduled,
        groupId: groupId ? +groupId : null,
      },
    });

    return {
      message: "success",
      errors: undefined,
      fieldValues: {
        seasonId: "",
        groupId: "",
        date: "",
        homeTeamId: "",
        awayTeamId: "",
        homeGoals: "",
        awayGoals: "",
        round: "",
      },
    };
  } catch (error) {
    const zodError = error as ZodError;
    const errorMap = zodError.flatten().fieldErrors;
    return {
      message: "error",
      errors: {
        seasonId: errorMap["seasonId"]?.[0] ?? "",
        groupId: errorMap["groupId"]?.[0] ?? "",
        date: errorMap["date"]?.[0] ?? "",
        homeTeamId: errorMap["homeTeamId"]?.[0] ?? "",
        awayTeamId: errorMap["awayTeamId"]?.[0] ?? "",
        homeGoals: errorMap["homeGoals"]?.[0] ?? "",
        awayGoals: errorMap["awayGoals"]?.[0] ?? "",
        round: errorMap["round"]?.[0] ?? "",
      },
      fieldValues: {
        seasonId,
        groupId,
        date,
        homeTeamId,
        awayTeamId,
        homeGoals,
        awayGoals,
        round,
      },
    };
  }

  // revalidatePath("/dashboard/league-matches");
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
