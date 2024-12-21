"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { CurrentStageSchema, SeasonSchema } from "@/schemas";
import { generateSlug } from "@/lib/generateSlug";
import { ZodError } from "zod";
import { deleteAndWriteImageFile, writeImageFile } from "@/lib/writeImageFile";
import { ImagesFolders } from "@/types/enums";

interface Fields {
  startYear: string;
  endYear: string;
  flagUrl?: string | null;
  leagueId: string;
  teams: string[];
  winnerId?: string | null;
  titleHolderId?: string | null;
  currentStage?: string | null;
  hostingCountries: string[];
}

interface ReturnType {
  errors: Record<keyof Fields, string | undefined> | undefined;
  success: boolean;
  customError?: string | null;
}

interface StageFields {
  currentStage?: string | null;
}

interface StageReturnType {
  errors: Record<keyof StageFields, string | undefined> | undefined;
  success: boolean;
  customError?: string | null;
}

export async function addSeason(
  prevState: ReturnType,
  formData: FormData
): Promise<ReturnType> {
  try {
    const result = SeasonSchema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (result.success === false) {
      const errors: Record<keyof Fields, string | undefined> = {
        leagueId: result.error.formErrors.fieldErrors.leagueId?.[0],
        startYear: result.error.formErrors.fieldErrors.startYear?.[0],
        endYear: result.error.formErrors.fieldErrors.endYear?.[0],
        teams: result.error.formErrors.fieldErrors.teams?.[0],
        flagUrl: result.error.formErrors.fieldErrors.flagUrl?.[0],
        winnerId: result.error.formErrors.fieldErrors.winnerId?.[0],
        titleHolderId: result.error.formErrors.fieldErrors.titleHolderId?.[0],
        currentStage: result.error.formErrors.fieldErrors.currentStage?.[0],
        hostingCountries:
          result.error.formErrors.fieldErrors.hostingCountries?.[0],
      };

      return { errors, success: false, customError: null };
    }

    const data = result.data;

    if (data.endYear < data.startYear) {
      return {
        errors: undefined,
        success: false,
        customError: "Start Year must be equal or less than End Year!",
      };
    }

    const season = await prisma.season.findFirst({
      where: {
        AND: [
          { startYear: data.startYear },
          { endYear: data.endYear },
          { leagueId: data.leagueId },
        ],
      },
    });

    if (season) {
      return {
        errors: undefined,
        success: false,
        customError: "Season existed",
      };
    }

    const league = await prisma.league.findUnique({
      where: { id: +data.leagueId },
    });

    if (!league) {
      return {
        errors: undefined,
        success: false,
        customError: "No League Found",
      };
    }

    let slug = generateSlug(
      league.name.toLowerCase().trim().split(" ").join("-")
    );

    let existedSeason = await prisma.season.findUnique({ where: { slug } });
    while (existedSeason) {
      slug = generateSlug(
        league.name.toLowerCase().trim().split(" ").join("-")
      ); // Generate a new slug if the one exists
      existedSeason = await prisma.season.findUnique({ where: { slug } });
    }

    const flagUrlPath = await writeImageFile(
      data.flagUrl,
      ImagesFolders.Leagues
    );

    const teams = await prisma.team.findMany({
      where: {
        id: {
          in: formData
            .getAll("teams")
            .toString()
            .split(",")
            .map((a) => +a),
        },
      },
    });

    const hostingCountries = await prisma.country.findMany({
      where: {
        id: {
          in: formData
            .getAll("hostingCountries")
            .toString()
            .split(",")
            .map((a) => +a),
        },
      },
    });

    await prisma.season.create({
      data: {
        leagueId: +data.leagueId,
        startYear: +data.startYear,
        endYear: +data.endYear,
        year:
          data.startYear === data.endYear
            ? data.startYear.toString()
            : `${data.startYear.toString()}-${data.endYear.toString()}`,
        flagUrl: flagUrlPath,
        teams: {
          connect: teams,
        },
        hostingCountries: {
          connect: hostingCountries,
        },
        winnerId: data.winnerId ? +data.winnerId : null,
        titleHolderId: data.titleHolderId ? +data.titleHolderId : null,
        currentStage: data.currentStage || "",
        slug,
      },
    });

    revalidatePath("/dashboard/seasons");
    return { errors: undefined, success: true, customError: null };
  } catch (error) {
    const zodError = error as ZodError;
    const errorMap = zodError.flatten().fieldErrors;
    return {
      success: false,
      customError: null,
      errors: {
        leagueId: errorMap["leagueId"]?.[0],
        startYear: errorMap["startYear"]?.[0],
        endYear: errorMap["endYear"]?.[0],
        flagUrl: errorMap["flagUrl"]?.[0],
        teams: errorMap["teams"]?.[0],
        hostingCountries: errorMap["hostingCountries"]?.[0],
        winnerId: errorMap["winnerId"]?.[0],
        titleHolderId: errorMap["titleHolderId"]?.[0],
        currentStage: errorMap["currentStage"]?.[0],
      },
    };
  }
}

export async function updateSeason(
  id: number,
  prevState: ReturnType,
  formData: FormData
): Promise<ReturnType> {
  try {
    const result = SeasonSchema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (result.success === false) {
      const errors: Record<keyof Fields, string | undefined> = {
        leagueId: result.error.formErrors.fieldErrors.leagueId?.[0],
        startYear: result.error.formErrors.fieldErrors.startYear?.[0],
        endYear: result.error.formErrors.fieldErrors.endYear?.[0],
        teams: result.error.formErrors.fieldErrors.teams?.[0],
        flagUrl: result.error.formErrors.fieldErrors.flagUrl?.[0],
        winnerId: result.error.formErrors.fieldErrors.winnerId?.[0],
        titleHolderId: result.error.formErrors.fieldErrors.titleHolderId?.[0],
        currentStage: result.error.formErrors.fieldErrors.currentStage?.[0],
        hostingCountries:
          result.error.formErrors.fieldErrors.hostingCountries?.[0],
      };

      return { errors, success: false, customError: null };
    }

    const data = result.data;

    if (data.endYear < data.startYear) {
      return {
        errors: undefined,
        success: false,
        customError: "Start Year must be equal or less than End Year!",
      };
    }

    const existedSeason = await prisma.season.findFirst({
      where: {
        AND: [
          { startYear: data.startYear },
          { endYear: data.endYear },
          { leagueId: data.leagueId },
          { id: { not: id } },
        ],
      },
    });

    if (existedSeason) {
      return {
        errors: undefined,
        success: false,
        customError: "Season existed",
      };
    }

    const currentSeason = await prisma.season.findUnique({
      where: { id },
      include: { teams: true, hostingCountries: true },
    });

    if (currentSeason == null) return notFound();

    const flagUrlPath = await deleteAndWriteImageFile(
      data.flagUrl,
      ImagesFolders.Leagues,
      currentSeason.flagUrl
    );

    const teams = await prisma.team.findMany({
      where: {
        id: {
          in: formData
            .getAll("teams")
            .toString()
            .split(",")
            .map((a) => +a),
        },
      },
    });

    const hostingCountries = await prisma.country.findMany({
      where: {
        id: {
          in: formData
            .getAll("hostingCountries")
            .toString()
            .split(",")
            .map((a) => +a),
        },
      },
    });

    await prisma.season.update({
      where: { id },
      data: {
        leagueId: +data.leagueId,
        startYear: +data.startYear,
        endYear: +data.endYear,
        year:
          data.startYear === data.endYear
            ? data.startYear.toString()
            : `${data.startYear.toString()}-${data.endYear.toString()}`,
        flagUrl: flagUrlPath,
        teams: {
          connect: teams,
        },
        hostingCountries: {
          connect: hostingCountries,
        },
        winnerId: data.winnerId ? +data.winnerId : null,
        titleHolderId: data.titleHolderId ? +data.titleHolderId : null,
        currentStage: data.currentStage || "",
      },
    });

    revalidatePath("/dashboard/seasons");
    return { errors: undefined, success: true, customError: null };
  } catch (error) {
    const zodError = error as ZodError;
    const errorMap = zodError.flatten().fieldErrors;
    return {
      success: false,
      customError: null,
      errors: {
        leagueId: errorMap["leagueId"]?.[0],
        startYear: errorMap["startYear"]?.[0],
        endYear: errorMap["endYear"]?.[0],
        flagUrl: errorMap["flagUrl"]?.[0],
        teams: errorMap["teams"]?.[0],
        hostingCountries: errorMap["hostingCountries"]?.[0],
        winnerId: errorMap["winnerId"]?.[0],
        titleHolderId: errorMap["titleHolderId"]?.[0],
        currentStage: errorMap["currentStage"]?.[0],
      },
    };
  }
}

export async function updateSeasonCurrentStage(
  id: number,
  prevState: unknown,
  formData: FormData
): Promise<StageReturnType> {
  try {
    const result = CurrentStageSchema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (result.success === false) {
      const errors: Record<keyof StageFields, string | undefined> = {
        currentStage: result.error.formErrors.fieldErrors.currentStage?.[0],
      };

      return { errors, success: false, customError: null };
    }

    const data = result.data;

    const currentSeason = await prisma.season.findUnique({
      where: { id },
    });

    if (currentSeason == null) return notFound();

    await prisma.season.update({
      where: { id },
      data: {
        currentStage: data.currentStage,
      },
    });

    revalidatePath("/dashboard/seasons");
    return { errors: undefined, success: true, customError: null };
  } catch (error) {
    const zodError = error as ZodError;
    const errorMap = zodError.flatten().fieldErrors;
    return {
      success: false,
      customError: null,
      errors: {
        currentStage: errorMap["currentStage"]?.[0],
      },
    };
  }
}
