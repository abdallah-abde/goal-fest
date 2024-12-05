"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { LeagueTeamSchema } from "@/schemas";
import { ZodError } from "zod";
import { deleteAndWriteImageFile, writeImageFile } from "@/lib/writeImageFile";

interface Fields {
  name: string;
  flagUrl?: string | null;
  countryId?: string | null;
  code?: string | null;
  type: string;
}

interface ReturnType {
  errors: Record<keyof Fields, string | undefined> | undefined;
  success: boolean;
  customError?: string | null;
}

export async function addLeagueTeam(
  prevState: ReturnType,
  formData: FormData
): Promise<ReturnType> {
  try {
    const result = LeagueTeamSchema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (result.success === false) {
      const errors: Record<keyof Fields, string | undefined> = {
        name: result.error.formErrors.fieldErrors.name?.[0],
        flagUrl: result.error.formErrors.fieldErrors.flagUrl?.[0],
        countryId: result.error.formErrors.fieldErrors.countryId?.[0],
        code: result.error.formErrors.fieldErrors.code?.[0],
        type: result.error.formErrors.fieldErrors.type?.[0],
      };

      return { errors, success: false, customError: null };
    }

    const data = result.data;

    const team = await prisma.leagueTeam.findFirst({
      where: { name: data.name },
    });

    if (team) {
      return {
        errors: undefined,
        success: false,
        customError: "League team existed",
      };
    }

    const flagUrlPath = await writeImageFile(data.flagUrl, "teams");

    await prisma.leagueTeam.create({
      data: {
        name: data.name,
        code: data.code ? data.code : null,
        flagUrl: flagUrlPath,
        countryId: data.countryId ? +data.countryId : null,
        type: data.type,
      },
    });

    revalidatePath("/dashboard/league-teams");
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
        code: errorMap["code"]?.[0],
        countryId: errorMap["countryId"]?.[0],
        type: errorMap["type"]?.[0],
      },
    };
  }
}

export async function updateLeagueTeam(
  id: number,
  prevState: ReturnType,
  formData: FormData
): Promise<ReturnType> {
  try {
    const result = LeagueTeamSchema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (result.success === false) {
      const errors: Record<keyof Fields, string | undefined> = {
        name: result.error.formErrors.fieldErrors.name?.[0],
        flagUrl: result.error.formErrors.fieldErrors.flagUrl?.[0],
        countryId: result.error.formErrors.fieldErrors.countryId?.[0],
        code: result.error.formErrors.fieldErrors.code?.[0],
        type: result.error.formErrors.fieldErrors.type?.[0],
      };

      return { errors, success: false, customError: null };
    }

    const data = result.data;

    const existedTeam = await prisma.leagueTeam.findFirst({
      where: { AND: [{ name: data.name }, { id: { not: id } }] },
    });

    if (existedTeam) {
      return {
        errors: undefined,
        success: false,
        customError: "League team existed",
      };
    }

    const team = await prisma.leagueTeam.findUnique({ where: { id } });

    if (team == null) return notFound();

    const flagUrlPath = await deleteAndWriteImageFile(
      data.flagUrl,
      "teams",
      team.flagUrl
    );

    await prisma.leagueTeam.update({
      where: { id },
      data: {
        name: data.name,
        code: data.code ? data.code : null,
        flagUrl: flagUrlPath,
        countryId: data.countryId ? +data.countryId : null,
        type: data.type,
      },
    });

    revalidatePath("/dashboard/league-teams");
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
        code: errorMap["code"]?.[0],
        countryId: errorMap["countryId"]?.[0],
        type: errorMap["type"]?.[0],
      },
    };
  }
}

export async function updateLeagueTeamPopularStatus(
  id: number,
  isPopular: boolean
) {
  try {
    const currentLeagueTeam = await prisma.leagueTeam.findUnique({
      where: { id },
    });

    if (currentLeagueTeam == null) return notFound();

    await prisma.leagueTeam.update({
      where: { id },
      data: {
        isPopular: !isPopular,
      },
    });

    revalidatePath("/dashboard/league-teams");
  } catch (error) {
    console.log(error);
  }
}
