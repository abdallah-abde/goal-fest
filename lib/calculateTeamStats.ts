import prisma from "@/lib/db";

export async function calculateTeamStats(teamId: number, groupId: number) {
  const homeMatches = await prisma.match.findMany({
    where: {
      homeTeamId: teamId,
      groupId: groupId,
      homeGoals: { not: null },
      awayGoals: { not: null },
    },
  });

  const awayMatches = await prisma.match.findMany({
    where: {
      awayTeamId: teamId,
      groupId: groupId,
      homeGoals: { not: null },
      awayGoals: { not: null },
    },
  });

  let played = homeMatches.length + awayMatches.length;
  let won = 0;
  let lost = 0;
  let draw = 0;
  let goalsFor = 0;
  let goalsAgainst = 0;
  let points = 0;

  homeMatches.forEach((match) => {
    if (match.homeGoals) goalsFor += match.homeGoals;
    if (match.awayGoals) goalsAgainst += match.awayGoals;
    if (match.homeGoals != null && match.awayGoals != null) {
      if (match.homeGoals > match.awayGoals) {
        won++;
        points += 3;
      } else if (match.homeGoals < match.awayGoals) {
        lost++;
      } else {
        draw++;
        points += 1;
      }
    }
  });

  awayMatches.forEach((match) => {
    if (match.awayGoals) goalsFor += match.awayGoals;
    if (match.homeGoals) goalsAgainst += match.homeGoals;
    if (match.homeGoals != null && match.awayGoals != null) {
      if (match.awayGoals > match.homeGoals) {
        won++;
        points += 3;
      } else if (match.awayGoals < match.homeGoals) {
        lost++;
      } else {
        draw++;
        points += 1;
      }
    }
  });

  return {
    played,
    won,
    lost,
    draw,
    goalsFor,
    goalsAgainst,
    goalDifference: goalsFor - goalsAgainst,
    points,
  };
}
