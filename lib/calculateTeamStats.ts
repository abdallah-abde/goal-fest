import prisma from "./db";

export const calculateTeamStats = async (teamId: number, groupId: number) => {
  const homeMatches = await prisma.match.findMany({
    where: { homeTeamId: teamId, groupId: groupId },
  });
  const awayMatches = await prisma.match.findMany({
    where: { awayTeamId: teamId, groupId: groupId },
  });

  let played = homeMatches.length + awayMatches.length;
  let won = 0;
  let lost = 0;
  let draw = 0;
  let goalsFor = 0;
  let goalsAgainst = 0;
  let points = 0;

  homeMatches.forEach((match) => {
    goalsFor += match.homeGoals;
    goalsAgainst += match.awayGoals;
    if (match.homeGoals > match.awayGoals) {
      won++;
      points += 3;
    } else if (match.homeGoals < match.awayGoals) {
      lost++;
    } else {
      draw++;
      points += 1;
    }
  });

  awayMatches.forEach((match) => {
    goalsFor += match.awayGoals;
    goalsAgainst += match.homeGoals;
    if (match.awayGoals > match.homeGoals) {
      won++;
      points += 3;
    } else if (match.awayGoals < match.homeGoals) {
      lost++;
    } else {
      draw++;
      points += 1;
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
};
