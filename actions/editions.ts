"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { EditionSchema, CurrentStageSchema } from "@/schemas";
import { TournamentStages } from "@/types/enums";
import { generateSlug } from "@/lib/generateSlug";
import { ZodError } from "zod";
import { deleteAndWriteImageFile, writeImageFile } from "@/lib/writeImageFile";

interface Fields {
  tournamentId: string;
  startYear: string;
  endYear: string;
  logoUrl?: string | null;
  winnerId?: string | null;
  titleHolderId?: string | null;
  hostingCountries: string[];
  teams: string[];
}

interface ReturnType {
  errors: Record<keyof Fields, string | undefined> | undefined;
  success: boolean;
  customError?: string | null;
}

export async function addTournamentEdition(
  prevState: ReturnType,
  formData: FormData
): Promise<ReturnType> {
  try {
    const result = EditionSchema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (result.success === false) {
      const errors: Record<keyof Fields, string | undefined> = {
        tournamentId: result.error.formErrors.fieldErrors.tournamentId?.[0],
        startYear: result.error.formErrors.fieldErrors.startYear?.[0],
        endYear: result.error.formErrors.fieldErrors.endYear?.[0],
        winnerId: result.error.formErrors.fieldErrors.winnerId?.[0],
        titleHolderId: result.error.formErrors.fieldErrors.titleHolderId?.[0],
        teams: result.error.formErrors.fieldErrors.teams?.[0],
        hostingCountries:
          result.error.formErrors.fieldErrors.hostingCountries?.[0],
        logoUrl: result.error.formErrors.fieldErrors.logoUrl?.[0],
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

    const edition = await prisma.tournamentEdition.findFirst({
      where: {
        AND: [
          { startYear: data.startYear },
          { endYear: data.endYear },
          { tournamentId: data.tournamentId },
        ],
      },
    });

    if (edition) {
      return {
        errors: undefined,
        success: false,
        customError: "Edition existed",
      };
    }

    const tournament = await prisma.tournament.findUnique({
      where: { id: +data.tournamentId },
    });

    if (!tournament) {
      return {
        errors: undefined,
        success: false,
        customError: "No Tournament Found",
      };
    }

    let slug = generateSlug(
      tournament.name.toLowerCase().trim().split(" ").join("-")
    );

    let exists = await prisma.tournamentEdition.findUnique({ where: { slug } });
    while (exists) {
      slug = generateSlug(
        tournament.name.toLowerCase().trim().split(" ").join("-")
      ); // Generate a new slug if the one exists
      exists = await prisma.tournamentEdition.findUnique({ where: { slug } });
    }

    const logoUrlPath = await writeImageFile(data.logoUrl, "tournaments");

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

    await prisma.tournamentEdition.create({
      data: {
        tournamentId: +data.tournamentId,
        startYear: +data.startYear,
        endYear: +data.endYear,
        year:
          data.startYear === data.endYear
            ? data.startYear.toString()
            : data.startYear.toString() + "-" + data.endYear.toString(),
        logoUrl: logoUrlPath,
        winnerId: data.winnerId ? +data.winnerId : null,
        titleHolderId: data.titleHolderId ? +data.titleHolderId : null,
        hostingCountries: {
          connect: hostingCountries,
        },
        teams: {
          connect: ts,
        },
        currentStage: TournamentStages.GroupsStage,
        slug,
      },
    });

    revalidatePath("/dashboard/editions");
    return { errors: undefined, success: true, customError: null };
  } catch (error) {
    const zodError = error as ZodError;
    const errorMap = zodError.flatten().fieldErrors;
    return {
      success: false,
      customError: null,
      errors: {
        tournamentId: errorMap["tournamentId"]?.[0],
        startYear: errorMap["startYear"]?.[0],
        endYear: errorMap["endYear"]?.[0],
        winnerId: errorMap["winnerId"]?.[0],
        titleHolderId: errorMap["titleHolderId"]?.[0],
        logoUrl: errorMap["logoUrl"]?.[0],
        hostingCountries: errorMap["hostingCountries"]?.[0],
        teams: errorMap["teams"]?.[0],
      },
    };
  }
}

export async function updateTournamentEdition(
  id: number,
  prevState: ReturnType,
  formData: FormData
): Promise<ReturnType> {
  try {
    const result = EditionSchema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (result.success === false) {
      const errors: Record<keyof Fields, string | undefined> = {
        tournamentId: result.error.formErrors.fieldErrors.tournamentId?.[0],
        startYear: result.error.formErrors.fieldErrors.startYear?.[0],
        endYear: result.error.formErrors.fieldErrors.endYear?.[0],
        winnerId: result.error.formErrors.fieldErrors.winnerId?.[0],
        titleHolderId: result.error.formErrors.fieldErrors.titleHolderId?.[0],
        teams: result.error.formErrors.fieldErrors.teams?.[0],
        hostingCountries:
          result.error.formErrors.fieldErrors.hostingCountries?.[0],
        logoUrl: result.error.formErrors.fieldErrors.logoUrl?.[0],
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

    const existedEdition = await prisma.tournamentEdition.findFirst({
      where: {
        AND: [
          { startYear: data.startYear },
          { endYear: data.endYear },
          { tournamentId: data.tournamentId },
          { id: { not: id } },
        ],
      },
    });

    if (existedEdition) {
      return {
        errors: undefined,
        success: false,
        customError: "Edition existed",
      };
    }

    const currentTournamentEdition = await prisma.tournamentEdition.findUnique({
      where: { id },
      include: { hostingCountries: true, teams: true },
    });

    if (currentTournamentEdition == null) return notFound();

    const logoUrlPath = await deleteAndWriteImageFile(
      data.logoUrl,
      "tournaments",
      currentTournamentEdition.logoUrl
    );

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

    await prisma.tournamentEdition.update({
      where: { id },
      data: {
        tournamentId: +data.tournamentId,
        startYear: +data.startYear,
        endYear: +data.endYear,
        year:
          data.startYear === data.endYear
            ? data.startYear.toString()
            : data.startYear.toString() + "-" + data.endYear.toString(),
        logoUrl: logoUrlPath,
        winnerId: data.winnerId ? +data.winnerId : null,
        titleHolderId: data.titleHolderId ? +data.titleHolderId : null,
        hostingCountries: {
          disconnect: currentTournamentEdition?.hostingCountries,
          connect: hostingCountries,
        },
        teams: {
          disconnect: currentTournamentEdition?.teams,
          connect: ts,
        },
      },
    });

    revalidatePath("/dashboard/editions");
    return { errors: undefined, success: true, customError: null };
  } catch (error) {
    const zodError = error as ZodError;
    const errorMap = zodError.flatten().fieldErrors;
    return {
      success: false,
      customError: null,
      errors: {
        tournamentId: errorMap["tournamentId"]?.[0],
        startYear: errorMap["startYear"]?.[0],
        endYear: errorMap["endYear"]?.[0],
        winnerId: errorMap["winnerId"]?.[0],
        titleHolderId: errorMap["titleHolderId"]?.[0],
        logoUrl: errorMap["logoUrl"]?.[0],
        hostingCountries: errorMap["hostingCountries"]?.[0],
        teams: errorMap["teams"]?.[0],
      },
    };
  }
}

export async function updateTournamentEditionCurrentStage(
  args: { id: number },
  prevState: unknown,
  formData: FormData
) {
  try {
    const { id } = args;

    const result = CurrentStageSchema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (result.success === false) {
      return result.error.formErrors.fieldErrors;
    }

    const data = result.data;

    const currentTournamentEdition = await prisma.tournamentEdition.findUnique({
      where: { id },
      include: { hostingCountries: true, teams: true },
    });

    if (currentTournamentEdition == null) return notFound();

    await prisma.tournamentEdition.update({
      where: { id },
      data: {
        currentStage: data.currentStage,
      },
    });

    revalidatePath("/dashboard/editions");
  } catch (error) {
    console.log(error);
  }
}
