"use server";

import prisma from "@/lib/db";

export async function addTournamentKnockoutMatch(
  prevState: unknown,
  formData: FormData
) {
  const data = Object.fromEntries(formData.entries());

  await prisma.knockoutMatch.create({
    data: {
      homeTeamId: data.homeTeamId ? +data.homeTeamId : null,
      awayTeamId: data.awayTeamId ? +data.awayTeamId : null,
      homeGoals: data.homeGoals ? +data.homeGoals : null,
      awayGoals: data.awayGoals ? +data.awayGoals : null,
      homeExtraTimeGoals: data.homeExtraTimeGoals
        ? +data.homeExtraTimeGoals
        : null,
      awayExtraTimeGoals: data.awayExtraTimeGoals
        ? +data.awayExtraTimeGoals
        : null,
      homePenaltyGoals: data.homePenaltyGoals ? +data.homePenaltyGoals : null,
      awayPenaltyGoals: data.awayPenaltyGoals ? +data.awayPenaltyGoals : null,
      date: data.date ? new Date(data.date.toString()) : null,
      tournamentEditionId: +data.tournamentEditionId,
      round: data.round ? data.round.toString() : null,
      homeTeamPlacehlder: data.homeTeamPlacehlder
        ? data.homeTeamPlacehlder.toString()
        : null,
      awayTeamPlacehlder: data.awayTeamPlacehlder
        ? data.awayTeamPlacehlder.toString()
        : null,
    },
  });
}

export async function updateTournamentKnockoutMatch(
  id: number,
  prevState: unknown,
  formData: FormData
) {
  const data = Object.fromEntries(formData.entries());

  await prisma.knockoutMatch.update({
    where: { id },
    data: {
      homeTeamId: data.homeTeamId ? +data.homeTeamId : null,
      awayTeamId: data.awayTeamId ? +data.awayTeamId : null,
      homeGoals: data.homeGoals ? +data.homeGoals : null,
      awayGoals: data.awayGoals ? +data.awayGoals : null,
      homeExtraTimeGoals: data.homeExtraTimeGoals
        ? +data.homeExtraTimeGoals
        : null,
      awayExtraTimeGoals: data.awayExtraTimeGoals
        ? +data.awayExtraTimeGoals
        : null,
      homePenaltyGoals: data.homePenaltyGoals ? +data.homePenaltyGoals : null,
      awayPenaltyGoals: data.awayPenaltyGoals ? +data.awayPenaltyGoals : null,
      date: data.date ? new Date(data.date.toString()) : null,
      tournamentEditionId: +data.tournamentEditionId,
      round: data.round ? data.round.toString() : null,
      homeTeamPlacehlder: data.homeTeamPlacehlder
        ? data.homeTeamPlacehlder.toString()
        : null,
      awayTeamPlacehlder: data.awayTeamPlacehlder
        ? data.awayTeamPlacehlder.toString()
        : null,
    },
  });
}
