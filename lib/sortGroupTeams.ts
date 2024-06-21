import { TeamWithStats } from "@/typings";

export const sortGroupTeams = (a: TeamWithStats, b: TeamWithStats) => {
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
};
