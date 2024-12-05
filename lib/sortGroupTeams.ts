import { LeagueTeamWithStats, NeutralMatch, TeamWithStats } from "@/types";
// import { Standing } from "@prisma/client";

export function sortGroupTeams(
  a: TeamWithStats | LeagueTeamWithStats,
  b: TeamWithStats | LeagueTeamWithStats
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

export function sortMatches(a: NeutralMatch, b: NeutralMatch) {
  if (a.date && b.date)
    if (a.date > b.date) {
      return -1;
    } else if (a.date < b.date) {
      return 1;
    } else {
      return 0;
    }

  return 0;
}

export function sortMatchesByRound(a: NeutralMatch, b: NeutralMatch) {
  try {
    const aStage: number = Number(a.stage.split(" ")[1]);
    const bStage: number = Number(b.stage.split(" ")[1]);

    if (aStage && bStage)
      if (aStage > bStage) {
        return -1;
      } else if (aStage < bStage) {
        return 1;
      } else {
        return 0;
      }

    return 0;
  } catch (error) {
    return 0;
  }
}

// export function sortStandings(a: Standing, b: Standing) {
//   if (a.points > b.points) {
//     return -1;
//   } else if (a.points < b.points) {
//     return 1;
//   } else {
//     const aTeamgoalDifference = a.goalsFor - a.goalsAgainst;
//     const bTeamgoalDifference = b.goalsFor - b.goalsAgainst;

//     if (aTeamgoalDifference > bTeamgoalDifference) {
//       return -1;
//     } else if (aTeamgoalDifference < bTeamgoalDifference) {
//       return 1;
//     } else {
//       if (a.goalsFor > b.goalsFor) {
//         return -1;
//       } else if (a.goalsFor < b.goalsFor) {
//         return 1;
//       } else return 0;
//     }
//   }
// }
