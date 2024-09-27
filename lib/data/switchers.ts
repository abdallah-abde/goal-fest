import { NeutralMatch } from "@/types";
import {
  Group,
  KnockoutMatch,
  Match,
  Team,
  TournamentEdition,
} from "@prisma/client";

interface MatchProps extends Match {
  group: Group;
  homeTeam: Team;
  awayTeam: Team;
  tournamentEdition: TournamentEdition;
}

interface KnockoutMatchProps extends KnockoutMatch {
  homeTeam: Team | null;
  awayTeam: Team | null;
  tournamentEdition: TournamentEdition;
}

export function switchGroupMatchesToNeutralMatches(matches: MatchProps[]) {
  const neutralMatches: NeutralMatch[] = [];

  matches.forEach((match) => {
    neutralMatches.push(switchGroupMatchToNeutralMatch(match));
  });

  return neutralMatches;
}

export function switchGroupMatchToNeutralMatch(match: MatchProps) {
  const neutralMatch: NeutralMatch = {
    dbId: match.id,
    id: crypto.randomUUID(),
    type: "GROUP",
    tournamentEdition: match.tournamentEdition,
    homeTeam: match.homeTeam,
    awayTeam: match.awayTeam,
    homeGoals: match.homeGoals,
    awayGoals: match.awayGoals,
    homeExtraTimeGoals: null,
    awayExtraTimeGoals: null,
    homePenaltyGoals: null,
    awayPenaltyGoals: null,
    date: match.date,
    onlyDate: match.date ? match.date.toLocaleDateString() : "",
    localDate: match.date ? match.date?.toLocaleString() : null,
    localDateOnlyDate: match.date
      ? match.date?.toLocaleString().split(",")[0]
      : null,
    localTime: match.date
      ? match.date?.toLocaleString("en-US", { hour12: false }).split(",")[1]
      : null,
    group: match.group,
    round: match.round,
    homeTeamPlaceholder: null,
    awayTeamPlaceholder: null,
    stage: "Groups Stage",
  };

  return neutralMatch;
}

export function switchKnockoutMatchesToNeutralMatches(
  matches: KnockoutMatchProps[]
) {
  const neutralMatches: NeutralMatch[] = [];

  matches.forEach((match) => {
    neutralMatches.push(switchKnockoutMatchToNeutralMatch(match));
  });

  return neutralMatches;
}

export function switchKnockoutMatchToNeutralMatch(match: KnockoutMatchProps) {
  const neutralMatch: NeutralMatch = {
    dbId: match.id,
    id: crypto.randomUUID(),
    type: "KNOCKOUT",
    tournamentEdition: match.tournamentEdition,
    homeTeam: match.homeTeam,
    awayTeam: match.awayTeam,
    homeGoals: match.homeGoals,
    awayGoals: match.awayGoals,
    homeExtraTimeGoals: match.homeExtraTimeGoals,
    awayExtraTimeGoals: match.awayExtraTimeGoals,
    homePenaltyGoals: match.homePenaltyGoals,
    awayPenaltyGoals: match.awayPenaltyGoals,
    date: match.date,
    onlyDate: match.date ? match.date.toLocaleDateString() : "",
    localDate: match.date ? match.date?.toLocaleString() : null,
    localDateOnlyDate: match.date
      ? match.date?.toLocaleString().split(",")[0]
      : null,
    localTime: match.date
      ? match.date?.toLocaleString("en-US", { hour12: false }).split(",")[1]
      : null,
    group: null,
    round: match.round,
    homeTeamPlaceholder: match.homeTeamPlacehlder,
    awayTeamPlaceholder: match.awayTeamPlacehlder,
    stage: match.round || "",
  };

  return neutralMatch;
}
