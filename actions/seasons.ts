"use server";

import prisma from "@/lib/db";
import fs from "fs/promises";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { CurrentStageSchema, SeasonSchema } from "@/schemas";
import { generateSlug } from "@/lib/generateSlug";
import { LeagueStages } from "@/types/enums";
import { ZodError } from "zod";

interface Fields {
  leagueId: string;
  startYear: string;
  endYear: string;
  teams: string[];
  logoUrl?: string;
}

interface ReturnType {
  errors: Record<keyof Fields, string | undefined> | undefined;
  success: boolean;
  customError?: string | null;
}

export async function addLeagueSeason(
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

    const season = await prisma.leagueSeason.findFirst({
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

    let exists = await prisma.leagueSeason.findUnique({ where: { slug } });
    while (exists) {
      slug = generateSlug(
        league.name.toLowerCase().trim().split(" ").join("-")
      ); // Generate a new slug if the one exists
      exists = await prisma.leagueSeason.findUnique({ where: { slug } });
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

    const leagueTeams = await prisma.leagueTeam.findMany({
      where: {
        id: {
          in: formData
            .getAll("leagueTeams")
            .toString()
            .split(",")
            .map((a) => +a),
        },
      },
    });

    await prisma.leagueSeason.create({
      data: {
        leagueId: +data.leagueId,
        startYear: +data.startYear,
        endYear: +data.endYear,
        year:
          data.startYear === data.endYear
            ? data.startYear.toString()
            : `${data.startYear.toString()}-${data.endYear.toString()}`,
        logoUrl: logoUrlPath,
        teams: {
          connect: leagueTeams,
        },
        currentStage: LeagueStages.Scheduled,
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
        logoUrl: errorMap["logoUrl"]?.[0],
        teams: errorMap["teams"]?.[0],
      },
    };
  }
}

export async function updateLeagueSeason(
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

    const existedSeason = await prisma.leagueSeason.findFirst({
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

    const currentLeagueSeason = await prisma.leagueSeason.findUnique({
      where: { id },
      include: { teams: true },
    });

    if (currentLeagueSeason == null) return notFound();

    let logoUrlPath = currentLeagueSeason.logoUrl;
    if (data.logoUrl != null && data.logoUrl.size > 0) {
      if (currentLeagueSeason.logoUrl)
        await fs.unlink(`public${currentLeagueSeason.logoUrl}`);

      logoUrlPath = `/images/tournaments/${crypto.randomUUID()}-${
        data.logoUrl.name
      }`;

      await fs.writeFile(
        `public${logoUrlPath}`,
        new Uint8Array(Buffer.from(await data.logoUrl.arrayBuffer()))
      );
    }

    const leagueTeams = await prisma.leagueTeam.findMany({
      where: {
        id: {
          in: formData
            .getAll("leagueTeams")
            .toString()
            .split(",")
            .map((a) => +a),
        },
      },
    });

    await prisma.leagueSeason.update({
      where: { id },
      data: {
        leagueId: +data.leagueId,
        startYear: +data.startYear,
        endYear: +data.endYear,
        year:
          data.startYear === data.endYear
            ? data.startYear.toString()
            : `${data.startYear.toString()}-${data.endYear.toString()}`,
        logoUrl: logoUrlPath,
        teams: {
          disconnect: currentLeagueSeason?.teams,
          connect: leagueTeams,
        },
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
        logoUrl: errorMap["logoUrl"]?.[0],
        teams: errorMap["teams"]?.[0],
      },
    };
  }
}

export async function updateLeagueSeasonCurrentStage(
  args: { id: number; searchParams: string },
  prevState: unknown,
  formData: FormData
) {
  const { id, searchParams } = args;

  const result = CurrentStageSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  const currentLeagueSeason = await prisma.leagueSeason.findUnique({
    where: { id },
  });

  if (currentLeagueSeason == null) return notFound();

  await prisma.leagueSeason.update({
    where: { id },
    data: {
      currentStage: data.currentStage,
    },
  });

  revalidatePath("/dashboard/seasons");
  redirect(`/dashboard/seasons${searchParams ? `?${searchParams}` : ""}`);
}
