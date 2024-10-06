import { TeamWithStats } from "@/types";
import { Standing } from "@prisma/client";

export function sortGroupTeams(a: TeamWithStats, b: TeamWithStats) {
  if (a.stats.points > b.stats.points) {
    return -1;
  } else if (a.stats.points < b.stats.points) {
    return 1;
  } else {
    if (a.stats.goalDifference > b.stats.goalDifference) {
      return -1;
    } else if (a.stats.goalDifference < b.stats.goalDifference) {
      return 1;
    } else {
      if (a.stats.goalsFor > b.stats.goalsFor) {
        return -1;
      } else if (a.stats.goalsFor < b.stats.goalsFor) {
        return 1;
      } else return 0;
    }
  }
}

export function sortStandings(a: Standing, b: Standing) {
  if (a.points > b.points) {
    return -1;
  } else if (a.points < b.points) {
    return 1;
  } else {
    const aTeamgoalDifference = a.goalsFor - a.goalsAgainst;
    const bTeamgoalDifference = b.goalsFor - b.goalsAgainst;

    if (aTeamgoalDifference > bTeamgoalDifference) {
      return -1;
    } else if (aTeamgoalDifference < bTeamgoalDifference) {
      return 1;
    } else {
      if (a.goalsFor > b.goalsFor) {
        return -1;
      } else if (a.goalsFor < b.goalsFor) {
        return 1;
      } else return 0;
    }
  }
}
