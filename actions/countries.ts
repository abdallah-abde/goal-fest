"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { CountrySchema } from "@/schemas";
import { ZodError } from "zod";
import { writeImageFile, deleteAndWriteImageFile } from "@/lib/writeImageFile";

interface Fields {
  name: string;
  flagUrl?: string | null;
  code?: string | null;
  continent?: string | null;
}

interface ReturnType {
  errors: Record<keyof Fields, string | undefined> | undefined;
  success: boolean;
  customError?: string | null;
}

export async function addCountry(
  prevState: ReturnType,
  formData: FormData
): Promise<ReturnType> {
  try {
    const result = CountrySchema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (result.success === false) {
      const errors: Record<keyof Fields, string | undefined> = {
        name: result.error.formErrors.fieldErrors.name?.[0],
        flagUrl: result.error.formErrors.fieldErrors.flagUrl?.[0],
        code: result.error.formErrors.fieldErrors.code?.[0],
        continent: result.error.formErrors.fieldErrors.continent?.[0],
      };

      return { errors, success: false, customError: null };
    }

    const data = result.data;

    const country = await prisma.country.findFirst({
      where: { name: data.name },
    });

    if (country) {
      return {
        errors: undefined,
        success: false,
        customError: "Country existed",
      };
    }

    const flagUrlPath = await writeImageFile(data.flagUrl, "countries");

    await prisma.country.create({
      data: {
        name: data.name,
        code: data.code ? data.code : null,
        flagUrl: flagUrlPath,
        continent: data.continent,
      },
    });

    revalidatePath("/dashboard/countries");
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
        continent: errorMap["continent"]?.[0],
      },
    };
  }
}

export async function updateCountry(
  id: number,
  prevState: ReturnType,
  formData: FormData
): Promise<ReturnType> {
  try {
    const result = CountrySchema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (result.success === false) {
      const errors: Record<keyof Fields, string | undefined> = {
        name: result.error.formErrors.fieldErrors.name?.[0],
        flagUrl: result.error.formErrors.fieldErrors.flagUrl?.[0],
        code: result.error.formErrors.fieldErrors.code?.[0],
        continent: result.error.formErrors.fieldErrors.continent?.[0],
      };

      return { errors, success: false, customError: null };
    }

    const data = result.data;

    const existedCountry = await prisma.country.findFirst({
      where: { AND: [{ name: data.name }, { id: { not: id } }] },
    });

    if (existedCountry) {
      return {
        errors: undefined,
        success: false,
        customError: "Country existed",
      };
    }

    const country = await prisma.country.findUnique({ where: { id } });

    if (country == null) return notFound();

    const flagUrlPath = await deleteAndWriteImageFile(
      data.flagUrl,
      "countries",
      country.flagUrl
    );

    await prisma.country.update({
      where: { id },
      data: {
        name: data.name,
        code: data.code ? data.code : null,
        flagUrl: flagUrlPath,
        continent: data.continent,
      },
    });

    revalidatePath("/dashboard/countries");
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
        continent: errorMap["continent"]?.[0],
      },
    };
  }
}
