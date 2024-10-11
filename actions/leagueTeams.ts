"use server";

import prisma from "@/lib/db";
import fs from "fs/promises";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { LeagueTeamSchema } from "@/schemas";

export async function addLeagueTeam(prevState: unknown, formData: FormData) {
  const result = LeagueTeamSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  const team = await prisma.leagueTeam.findFirst({
    where: { name: data.name },
  });

  if (team) return { name: ["Team existed"] };

  let flagUrlPath = "";
  if (data.flagUrl != null && data.flagUrl.size > 0) {
    flagUrlPath = `/images/teams/${crypto.randomUUID()}-${data.flagUrl.name}`;

    await fs.writeFile(
      `public${flagUrlPath}`,
      Buffer.from(await data.flagUrl.arrayBuffer())
    );
  }

  await prisma.leagueTeam.create({
    data: {
      name: data.name.toString(),
      code: data.code ? data.code.toString() : null,
      flagUrl: flagUrlPath,
    },
  });

  revalidatePath("/dashboard/league-teams");
  redirect("/dashboard/league-teams");
}

export async function updateLeagueTeam(
  id: number,
  prevState: unknown,
  formData: FormData
) {
  const result = LeagueTeamSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  const existedTeam = await prisma.leagueTeam.findFirst({
    where: { AND: [{ name: data.name }, { id: { not: id } }] },
  });

  if (existedTeam) return { name: ["Team existed"] };

  const team = await prisma.leagueTeam.findUnique({ where: { id } });

  if (team == null) return notFound();

  let flagUrlPath = team.flagUrl;
  if (data.flagUrl != null && data.flagUrl.size > 0) {
    if (team.flagUrl) await fs.unlink(`public${team.flagUrl}`);

    flagUrlPath = `/images/teams/${crypto.randomUUID()}-${data.flagUrl.name}`;

    await fs.writeFile(
      `public${flagUrlPath}`,
      Buffer.from(await data.flagUrl.arrayBuffer())
    );
  }

  await prisma.leagueTeam.update({
    where: { id },
    data: {
      name: data.name.toString(),
      code: data.code ? data.code.toString() : null,
      flagUrl: flagUrlPath,
    },
  });

  revalidatePath("/dashboard/league-teams");
  redirect("/dashboard/league-teams");
}
