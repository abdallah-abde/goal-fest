"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import {
  GroupMatchSchema,
  MatchScoreSchema,
  MatchStatusSchema,
} from "@/schemas";
import { MatchStatusOptions } from "@/types/enums";
import { ZodError } from "zod";

interface Fields {
  tournamentEditionId: string;
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

export async function addTournamentGroupMatch(
  prevState: ReturnType,
  formData: FormData
): Promise<ReturnType> {
  try {
    const result = GroupMatchSchema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (result.success === false) {
      const errors: Record<keyof Fields, string | undefined> = {
        tournamentEditionId:
          result.error.formErrors.fieldErrors.tournamentEditionId?.[0],
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

    await prisma.match.create({
      data: {
        homeTeamId: +data.homeTeamId,
        awayTeamId: +data.awayTeamId,
        homeGoals: homeGoals ? +homeGoals : null,
        awayGoals: awayGoals ? +awayGoals : null,
        date: data.date ? new Date(data.date.toString()) : null,
        groupId: +data.groupId,
        tournamentEditionId: +data.tournamentEditionId,
        round: data.round ? data.round : null,
        status: MatchStatusOptions.Scheduled,
      },
    });

    revalidatePath("/dashboard/matches");
    return { errors: undefined, success: true, customError: null };
  } catch (error) {
    const zodError = error as ZodError;
    const errorMap = zodError.flatten().fieldErrors;
    return {
      success: false,
      customError: null,
      errors: {
        tournamentEditionId: errorMap["tournamentEditionId"]?.[0],
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

export async function updateTournamentGroupMatch(
  id: number,
  prevState: ReturnType,
  formData: FormData
): Promise<ReturnType> {
  try {
    const result = GroupMatchSchema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (result.success === false) {
      const errors: Record<keyof Fields, string | undefined> = {
        tournamentEditionId:
          result.error.formErrors.fieldErrors.tournamentEditionId?.[0],
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

    const currentMatch = await prisma.match.findUnique({
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

    await prisma.match.update({
      where: { id },
      data: {
        homeTeamId: +data.homeTeamId,
        awayTeamId: +data.awayTeamId,
        homeGoals: homeGoals ? +homeGoals : null,
        awayGoals: awayGoals ? +awayGoals : null,
        date: data.date ? new Date(data.date.toString()) : null,
        groupId: +data.groupId,
        tournamentEditionId: +data.tournamentEditionId,
        round: data.round ? data.round : null,
      },
    });

    revalidatePath("/dashboard/matches");
    return { errors: undefined, success: true, customError: null };
  } catch (error) {
    const zodError = error as ZodError;
    const errorMap = zodError.flatten().fieldErrors;
    return {
      success: false,
      customError: null,
      errors: {
        tournamentEditionId: errorMap["tournamentEditionId"]?.[0],
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

export async function updateGroupMatchFeaturedStatus(
  id: number,
  isFeatured: boolean
) {
  try {
    const currentMatch = await prisma.match.findUnique({
      where: { id },
    });

    if (currentMatch == null) return notFound();

    await prisma.match.update({
      where: { id },
      data: {
        isFeatured: !isFeatured,
      },
    });

    revalidatePath("/dashboard/matches");
  } catch (error) {
    console.log(error);
  }
}

export async function updateGroupMatchScore(
  args: { id: number },
  prevState: unknown,
  formData: FormData
) {
  try {
    const { id } = args;

    const result = MatchScoreSchema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (result.success === false) {
      return result.error.formErrors.fieldErrors;
    }

    const currentMatch = await prisma.match.findUnique({
      where: { id },
    });

    if (currentMatch == null) return notFound();

    const homeGoals = formData.get("homeGoals");
    const awayGoals = formData.get("awayGoals");

    await prisma.match.update({
      where: { id },
      data: {
        homeGoals: homeGoals ? +homeGoals : null,
        awayGoals: awayGoals ? +awayGoals : null,
      },
    });

    revalidatePath("/dashboard/matches");
  } catch (error) {
    console.log(error);
  }
}

export async function updateGroupMatchStatus(
  args: { id: number },
  prevState: unknown,
  formData: FormData
) {
  try {
    const { id } = args;

    const result = MatchStatusSchema.safeParse(
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
        status: data.status,
      },
    });

    revalidatePath("/dashboard/matches");
  } catch (error) {
    console.log(error);
  }
}
