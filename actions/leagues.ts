"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { LeagueSchema } from "@/schemas";
import { ZodError } from "zod";
import { IsPopularOptions, LeagueTypes } from "@/types/enums";
import { deleteAndWriteImageFile, writeImageFile } from "@/lib/writeImageFile";

interface Fields {
  name: string;
  flagUrl?: string | null;
  countryId?: string | null;
  continent: string;
  isDomestic: string;
  isClubs: string;
  isPopular: string;
}

interface ReturnType {
  errors: Record<keyof Fields, string | undefined> | undefined;
  success: boolean;
  customError?: string | null;
}

export async function addLeague(
  prevState: ReturnType,
  formData: FormData
): Promise<ReturnType> {
  try {
    const result = LeagueSchema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (result.success === false) {
      const errors: Record<keyof Fields, string | undefined> = {
        name: result.error.formErrors.fieldErrors.name?.[0],
        flagUrl: result.error.formErrors.fieldErrors.flagUrl?.[0],
        countryId: result.error.formErrors.fieldErrors.countryId?.[0],
        continent: result.error.formErrors.fieldErrors.continent?.[0],
        isDomestic: result.error.formErrors.fieldErrors.isDomestic?.[0],
        isClubs: result.error.formErrors.fieldErrors.isClubs?.[0],
        isPopular: result.error.formErrors.fieldErrors.isPopular?.[0],
      };

      return { errors, success: false, customError: null };
    }

    const data = result.data;

    if (data.continent === LeagueTypes.Domestic && data.countryId === 0) {
      return {
        errors: undefined,
        success: false,
        customError: `Country is required when Continent is ${LeagueTypes.Domestic}`,
      };
    }

    const flagUrlPath = await writeImageFile(data.flagUrl, "tournaments");

    await prisma.league.create({
      data: {
        name: data.name,
        flagUrl: flagUrlPath,
        countryId: data.countryId ? +data.countryId : null,
        continent: data.continent,
        isDomestic: data.isDomestic === IsPopularOptions.Yes ? true : false,
        isClubs: data.isClubs === IsPopularOptions.Yes ? true : false,
        isPopular: data.isPopular === IsPopularOptions.Yes ? true : false,
      },
    });

    revalidatePath("/dashboard/leagues");
    return { errors: undefined, success: true, customError: null };
  } catch (error) {
    const zodError = error as ZodError;
    const errorMap = zodError.flatten().fieldErrors;
    return {
      success: false,
      customError: null,
      errors: {
        name: errorMap["name"]?.[0],
        flagUrl: errorMap["flagUrl"]?.[0],
        countryId: errorMap["countryId"]?.[0],
        continent: errorMap["continent"]?.[0],
        isDomestic: errorMap["isDomestic"]?.[0],
        isClubs: errorMap["isClubs"]?.[0],
        isPopular: errorMap["isPopular"]?.[0],
      },
    };
  }
}

export async function updateLeague(
  id: number,
  prevState: ReturnType,
  formData: FormData
): Promise<ReturnType> {
  try {
    const result = LeagueSchema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (result.success === false) {
      const errors: Record<keyof Fields, string | undefined> = {
        name: result.error.formErrors.fieldErrors.name?.[0],
        flagUrl: result.error.formErrors.fieldErrors.flagUrl?.[0],
        countryId: result.error.formErrors.fieldErrors.countryId?.[0],
        continent: result.error.formErrors.fieldErrors.continent?.[0],
        isDomestic: result.error.formErrors.fieldErrors.isDomestic?.[0],
        isClubs: result.error.formErrors.fieldErrors.isClubs?.[0],
        isPopular: result.error.formErrors.fieldErrors.isPopular?.[0],
      };

      return { errors, success: false, customError: null };
    }

    const data = result.data;

    if (data.continent === LeagueTypes.Domestic && data.countryId === 0) {
      return {
        errors: undefined,
        success: false,
        customError: `Country is required when Continent is ${LeagueTypes.Domestic}`,
      };
    }

    const league = await prisma.league.findUnique({ where: { id } });

    if (league == null) return notFound();

    const flagUrlPath = await deleteAndWriteImageFile(
      data.flagUrl,
      "tournaments",
      league.flagUrl
    );

    await prisma.league.update({
      where: { id },
      data: {
        name: data.name,
        flagUrl: flagUrlPath,
        countryId: data.countryId ? +data.countryId : null,
        continent: data.continent,
        isDomestic: data.isDomestic === IsPopularOptions.Yes ? true : false,
        isClubs: data.isClubs === IsPopularOptions.Yes ? true : false,
        isPopular: data.isPopular === IsPopularOptions.Yes ? true : false,
      },
    });

    revalidatePath("/dashboard/leagues");
    return { errors: undefined, success: true, customError: null };
  } catch (error) {
    const zodError = error as ZodError;
    const errorMap = zodError.flatten().fieldErrors;
    return {
      success: false,
      customError: null,
      errors: {
        name: errorMap["name"]?.[0],
        flagUrl: errorMap["flagUrl"]?.[0],
        countryId: errorMap["countryId"]?.[0],
        continent: errorMap["continent"]?.[0],
        isDomestic: errorMap["isDomestic"]?.[0],
        isClubs: errorMap["isClubs"]?.[0],
        isPopular: errorMap["isPopular"]?.[0],
      },
    };
  }
}

export async function updateLeaguePopularStatus(
  id: number,
  isPopular: boolean
) {
  try {
    const currentLeague = await prisma.league.findUnique({
      where: { id },
    });

    if (currentLeague == null) return notFound();

    await prisma.league.update({
      where: { id },
      data: {
        isPopular: !isPopular,
      },
    });

    revalidatePath("/dashboard/leagues");
  } catch (error) {
    console.log(error);
  }
}
