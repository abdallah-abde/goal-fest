"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  tournamentEditionId: z.coerce.number().int(),
  teams: z.string().optional(),
});

export async function addTournamentGroup(
  prevState: unknown,
  formData: FormData
) {
  const result = schema.safeParse(Object.fromEntries(formData.entries()));

  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

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
      name: data.name.toString(),
      tournamentEditionId: +data.tournamentEditionId,
      teams: {
        connect: ts,
      },
    },
  });

  revalidatePath("/dashboard/groups");
  redirect("/dashboard/groups");
}

export async function updateTournamentGroup(
  id: number,
  prevState: unknown,
  formData: FormData
) {
  const result = schema.safeParse(Object.fromEntries(formData.entries()));

  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

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
      name: data.name.toString(),
      tournamentEditionId: +data.tournamentEditionId,
      teams: {
        disconnect: currentGroup?.teams,
        connect: ts,
      },
    },
  });

  revalidatePath("/dashboard/groups");
  redirect("/dashboard/groups");
}
