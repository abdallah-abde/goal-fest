"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { GroupSchema } from "@/schemas";
import { ZodError } from "zod";

interface Fields {
  name: string;
  seasonId: string;
  teams: string[];
}

interface ReturnType {
  errors: Record<keyof Fields, string | undefined> | undefined;
  success: boolean;
  customError?: string | null;
}

export async function addGroup(
  prevState: ReturnType,
  formData: FormData
): Promise<ReturnType> {
  try {
    const result = GroupSchema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (result.success === false) {
      const errors: Record<keyof Fields, string | undefined> = {
        name: result.error.formErrors.fieldErrors.name?.[0],
        seasonId: result.error.formErrors.fieldErrors.seasonId?.[0],
        teams: result.error.formErrors.fieldErrors.teams?.[0],
      };

      return { errors, success: false, customError: null };
    }

    const data = result.data;

    const group = await prisma.group.findFirst({
      where: { name: data.name, seasonId: +data.seasonId },
    });

    if (group) {
      return {
        errors: undefined,
        success: false,
        customError: "Group existed",
      };
    }

    const ts = await prisma.team.findMany({
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

    await prisma.group.create({
      data: {
        name: data.name,
        seasonId: +data.seasonId,
        teams: {
          connect: ts,
        },
      },
    });

    revalidatePath("/dashboard/groups");
    return { errors: undefined, success: true, customError: null };
  } catch (error) {
    const zodError = error as ZodError;
    const errorMap = zodError.flatten().fieldErrors;
    return {
      success: false,
      customError: null,
      errors: {
        name: errorMap["name"]?.[0],
        seasonId: errorMap["seasonId"]?.[0],
        teams: errorMap["teams"]?.[0],
      },
    };
  }
}

export async function updateGroup(
  id: number,
  prevState: ReturnType,
  formData: FormData
): Promise<ReturnType> {
  try {
    const result = GroupSchema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (result.success === false) {
      const errors: Record<keyof Fields, string | undefined> = {
        name: result.error.formErrors.fieldErrors.name?.[0],
        seasonId: result.error.formErrors.fieldErrors.seasonId?.[0],
        teams: result.error.formErrors.fieldErrors.teams?.[0],
      };

      return { errors, success: false, customError: null };
    }

    const data = result.data;

    const group = await prisma.group.findFirst({
      where: {
        AND: [
          { name: data.name, seasonId: +data.seasonId },
          { id: { not: id } },
        ],
      },
    });

    if (group) {
      return {
        errors: undefined,
        success: false,
        customError: "Group existed",
      };
    }

    const currentGroup = await prisma.group.findUnique({
      where: { id },
      include: { teams: true },
    });

    if (currentGroup == null) return notFound();

    const ts = await prisma.team.findMany({
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

    await prisma.group.update({
      where: { id },
      data: {
        name: data.name,
        seasonId: +data.seasonId,
        teams: {
          disconnect: currentGroup?.teams,
          connect: ts,
        },
      },
    });

    revalidatePath("/dashboard/groups");
    return { errors: undefined, success: true, customError: null };
  } catch (error) {
    const zodError = error as ZodError;
    const errorMap = zodError.flatten().fieldErrors;
    return {
      success: false,
      customError: null,
      errors: {
        name: errorMap["name"]?.[0],
        seasonId: errorMap["seasonId"]?.[0],
        teams: errorMap["teams"]?.[0],
      },
    };
  }
}
