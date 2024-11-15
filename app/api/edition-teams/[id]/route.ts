import prisma from "@/lib/db";
import { TournamentTypes } from "@/types/enums";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const tournament = await prisma.tournament.findUnique({
    where: { id: +params.id },
  });

  if (!tournament) {
    return Response.json([]);
  }

  const where =
    tournament.type === TournamentTypes.International
      ? {}
      : { type: tournament.type };

  const res = await prisma.team.findMany({
    where: {
      ...where,
    },
  });

  return Response.json(res);
}
