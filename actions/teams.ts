"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { TeamSchema } from "@/schemas";
import { ZodError } from "zod";
import { deleteAndWriteImageFile, writeImageFile } from "@/lib/writeImageFile";

interface Fields {
  name: string;
  flagUrl?: string | null;
  code?: string | null;
  type: string;
}

interface ReturnType {
  errors: Record<keyof Fields, string | undefined> | undefined;
  success: boolean;
  customError?: string | null;
}

export async function addTeam(
  prevState: ReturnType,
  formData: FormData
): Promise<ReturnType> {
  try {
    const result = TeamSchema.safeParse(Object.fromEntries(formData.entries()));

    if (result.success === false) {
      const errors: Record<keyof Fields, string | undefined> = {
        name: result.error.formErrors.fieldErrors.name?.[0],
        flagUrl: result.error.formErrors.fieldErrors.flagUrl?.[0],
        code: result.error.formErrors.fieldErrors.code?.[0],
        type: result.error.formErrors.fieldErrors.type?.[0],
      };

      return { errors, success: false, customError: null };
    }

    const data = result.data;

    const team = await prisma.team.findFirst({
      where: { name: data.name },
    });

    if (team) {
      return {
        errors: undefined,
        success: false,
        customError: "Team existed",
      };
    }

    const flagUrlPath = await writeImageFile(data.flagUrl, "teams");

    await prisma.team.create({
      data: {
        name: data.name,
        code: data.code ? data.code : null,
        flagUrl: flagUrlPath,
        type: data.type,
      },
    });

    revalidatePath("/dashboard/teams");
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
        type: errorMap["type"]?.[0],
      },
    };
  }
}

export async function updateTeam(
  id: number,
  prevState: ReturnType,
  formData: FormData
): Promise<ReturnType> {
  try {
    const result = TeamSchema.safeParse(Object.fromEntries(formData.entries()));

    if (result.success === false) {
      const errors: Record<keyof Fields, string | undefined> = {
        name: result.error.formErrors.fieldErrors.name?.[0],
        flagUrl: result.error.formErrors.fieldErrors.flagUrl?.[0],
        code: result.error.formErrors.fieldErrors.code?.[0],
        type: result.error.formErrors.fieldErrors.type?.[0],
      };

      return { errors, success: false, customError: null };
    }

    const data = result.data;

    const existedTeam = await prisma.team.findFirst({
      where: { AND: [{ name: data.name }, { id: { not: id } }] },
    });

    if (existedTeam) {
      return {
        errors: undefined,
        success: false,
        customError: "Team existed",
      };
    }

    const team = await prisma.team.findUnique({ where: { id } });

    if (team == null) return notFound();

    const flagUrlPath = await deleteAndWriteImageFile(
      data.flagUrl,
      "teams",
      team.flagUrl
    );

    await prisma.team.update({
      where: { id },
      data: {
        name: data.name,
        code: data.code ? data.code : null,
        flagUrl: flagUrlPath,
        type: data.type,
      },
    });

    revalidatePath("/dashboard/teams");
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
        type: errorMap["type"]?.[0],
      },
    };
  }
}
