import { TeamWithStats } from "@/types";

export function sortGroupTeams(
  a: TeamWithStats | TeamWithStats,
  b: TeamWithStats | TeamWithStats
) {
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
