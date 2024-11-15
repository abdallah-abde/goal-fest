"use server";

import prisma from "@/lib/db";
import fs from "fs/promises";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { LeagueSchema } from "@/schemas";
import { ZodError } from "zod";
import { LeagueTypes } from "@/types/enums";

interface Fields {
  name: string;
  logoUrl?: string | null;
  countryId?: string | null;
  type: string;
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
        logoUrl: result.error.formErrors.fieldErrors.logoUrl?.[0],
        countryId: result.error.formErrors.fieldErrors.countryId?.[0],
        type: result.error.formErrors.fieldErrors.type?.[0],
      };

      return { errors, success: false, customError: null };
    }

    const data = result.data;

    if (data.type === LeagueTypes.Domestic && data.countryId === 0) {
      return {
        errors: undefined,
        success: false,
        customError: `Country is required when Type is ${LeagueTypes.Domestic}`,
      };
    }

    let logoUrlPath = "";
    if (data.logoUrl != null && data.logoUrl.size > 0) {
      logoUrlPath = `/images/tournaments/${crypto.randomUUID()}-${
        data.logoUrl.name
      }`;

      await fs.writeFile(
        `public${logoUrlPath}`,
        new Uint8Array(Buffer.from(await data.logoUrl.arrayBuffer()))
      );
    }

    await prisma.league.create({
      data: {
        name: data.name,
        logoUrl: logoUrlPath,
        countryId: data.countryId ? +data.countryId : null,
        type: data.type,
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
        logoUrl: errorMap["logoUrl"]?.[0],
        countryId: errorMap["countryId"]?.[0],
        type: errorMap["type"]?.[0],
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
        logoUrl: result.error.formErrors.fieldErrors.logoUrl?.[0],
        countryId: result.error.formErrors.fieldErrors.countryId?.[0],
        type: result.error.formErrors.fieldErrors.type?.[0],
      };

      return { errors, success: false, customError: null };
    }

    const data = result.data;

    if (data.type === LeagueTypes.Domestic && data.countryId === 0) {
      return {
        errors: undefined,
        success: false,
        customError: `Country is required when Type is ${LeagueTypes.Domestic}`,
      };
    }

    const league = await prisma.league.findUnique({ where: { id } });

    if (league == null) return notFound();

    let logoUrlPath = league.logoUrl;
    if (data.logoUrl != null && data.logoUrl.size > 0) {
      if (league.logoUrl) await fs.unlink(`public${league.logoUrl}`);

      logoUrlPath = `/images/tournaments/${crypto.randomUUID()}-${
        data.logoUrl.name
      }`;

      await fs.writeFile(
        `public${logoUrlPath}`,
        new Uint8Array(Buffer.from(await data.logoUrl.arrayBuffer()))
      );
    }

    await prisma.league.update({
      where: { id },
      data: {
        name: data.name.toString(),
        logoUrl: logoUrlPath,
        countryId: data.countryId ? +data.countryId : null,
        type: data.type.toString(),
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
        logoUrl: errorMap["logoUrl"]?.[0],
        countryId: errorMap["countryId"]?.[0],
        type: errorMap["type"]?.[0],
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
