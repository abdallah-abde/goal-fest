"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { TournamentSchema } from "@/schemas";
import { ZodError } from "zod";
import { IsPopularOptions } from "@/types/enums";
import { deleteAndWriteImageFile, writeImageFile } from "@/lib/writeImageFile";

interface Fields {
  name: string;
  logoUrl?: string | null;
  type: string;
  isPopular: boolean;
}

interface ReturnType {
  errors: Record<keyof Fields, string | undefined> | undefined;
  success: boolean;
  customError?: string | null;
}

export async function addTournament(
  prevState: ReturnType,
  formData: FormData
): Promise<ReturnType> {
  try {
    const result = TournamentSchema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (result.success === false) {
      const errors: Record<keyof Fields, string | undefined> = {
        name: result.error.formErrors.fieldErrors.name?.[0],
        logoUrl: result.error.formErrors.fieldErrors.logoUrl?.[0],
        type: result.error.formErrors.fieldErrors.type?.[0],
        isPopular: result.error.formErrors.fieldErrors.isPopular?.[0],
      };

      return { errors, success: false, customError: null };
    }

    const data = result.data;

    const tournament = await prisma.tournament.findFirst({
      where: { name: data.name },
    });

    if (tournament) {
      return {
        errors: undefined,
        success: false,
        customError: `Tournament existed`,
      };
    }

    const logoUrlPath = await writeImageFile(data.logoUrl, "tournaments");

    await prisma.tournament.create({
      data: {
        name: data.name,
        logoUrl: logoUrlPath,
        type: data.type,
        isPopular: data.isPopular === IsPopularOptions.Yes,
      },
    });

    revalidatePath("/dashboard/tournaments");
    return { errors: undefined, success: true, customError: null };
  } catch (error) {
    const zodError = error as ZodError;
    const errorMap = zodError.flatten().fieldErrors;
    return {
      success: false,
      customError: null,
      errors: {
        name: errorMap["name"]?.[0],
        logoUrl: errorMap["logoUrl"]?.[0],
        type: errorMap["type"]?.[0],
        isPopular: errorMap["isPopular"]?.[0],
      },
    };
  }
}

export async function updateTournament(
  id: number,
  prevState: ReturnType,
  formData: FormData
): Promise<ReturnType> {
  try {
    const result = TournamentSchema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (result.success === false) {
      const errors: Record<keyof Fields, string | undefined> = {
        name: result.error.formErrors.fieldErrors.name?.[0],
        logoUrl: result.error.formErrors.fieldErrors.logoUrl?.[0],
        type: result.error.formErrors.fieldErrors.type?.[0],
        isPopular: result.error.formErrors.fieldErrors.isPopular?.[0],
      };

      return { errors, success: false, customError: null };
    }

    const data = result.data;

    const existedTournament = await prisma.tournament.findFirst({
      where: { AND: [{ name: data.name }, { id: { not: id } }] },
    });

    if (existedTournament) {
      return {
        errors: undefined,
        success: false,
        customError: `Tournament existed`,
      };
    }

    const tournament = await prisma.tournament.findUnique({ where: { id } });

    if (tournament == null) return notFound();

    const logoUrlPath = await deleteAndWriteImageFile(
      data.logoUrl,
      "tournaments",
      tournament.logoUrl
    );

    await prisma.tournament.update({
      where: { id },
      data: {
        name: data.name,
        logoUrl: logoUrlPath,
        type: data.type,
        isPopular: data.isPopular === IsPopularOptions.Yes,
      },
    });

    revalidatePath("/dashboard/tournaments");
    return { errors: undefined, success: true, customError: null };
  } catch (error) {
    const zodError = error as ZodError;
    const errorMap = zodError.flatten().fieldErrors;
    return {
      success: false,
      customError: null,
      errors: {
        name: errorMap["name"]?.[0],
        logoUrl: errorMap["logoUrl"]?.[0],
        type: errorMap["type"]?.[0],
        isPopular: errorMap["isPopular"]?.[0],
      },
    };
  }
}

export async function updateTournamentPopularStatus(
  id: number,
  isPopular: boolean
) {
  try {
    const currentTournament = await prisma.tournament.findUnique({
      where: { id },
    });

    if (currentTournament == null) return notFound();

    await prisma.tournament.update({
      where: { id },
      data: {
        isPopular: !isPopular,
      },
    });

    revalidatePath("/dashboard/tournaments");
  } catch (error) {
    console.log(error);
  }
}
