import { NeutralMatch } from "@/types";
import {
  Group,
  Country,
  KnockoutMatch,
  League,
  LeagueMatch,
  LeagueSeason,
  LeagueTeam,
  Match,
  Team,
  Tournament,
  TournamentEdition,
} from "@prisma/client";

interface MatchProps extends Match {
  group: Group;
  homeTeam: Team;
  awayTeam: Team;
  tournamentEdition: TournamentEdition & {
    tournament: Tournament;
    hostingCountries: Country[];
  };
}

interface KnockoutMatchProps extends KnockoutMatch {
  homeTeam: Team | null;
  awayTeam: Team | null;
  tournamentEdition: TournamentEdition & {
    tournament: Tournament;
    hostingCountries: Country[];
  };
}

interface LeagueProps extends League {
  country: Country | null;
}

interface LeagueSeasonProps extends LeagueSeason {
  league: LeagueProps;
}

interface LeagueMatchProps extends LeagueMatch {
  homeTeam: LeagueTeam;
  awayTeam: LeagueTeam;
  season: LeagueSeasonProps;
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
    season: null,
    tournamentOrLeagueName: match.tournamentEdition.tournament.name,
    tournamentOrLeagueYear: match.tournamentEdition.yearAsString,
    country: match.tournamentEdition.tournament.type,
    fullTournamentName: `${match.tournamentEdition.tournament.name} (${match.tournamentEdition.yearAsString})`,
    homeTeam: match.homeTeam,
    awayTeam: match.awayTeam,
    homeGoals: match.homeGoals,
    awayGoals: match.awayGoals,
    homeExtraTimeGoals: null,
    awayExtraTimeGoals: null,
    homePenaltyGoals: null,
    awayPenaltyGoals: null,
    date: match.date,
    onlyDate: match.date ? match.date.toLocaleString() : "",
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
    season: null,
    tournamentOrLeagueName: match.tournamentEdition.tournament.name,
    tournamentOrLeagueYear: match.tournamentEdition.yearAsString,
    country: match.tournamentEdition.tournament.type,
    fullTournamentName: `${match.tournamentEdition.tournament.name} (${match.tournamentEdition.yearAsString})`,
    homeTeam: match.homeTeam,
    awayTeam: match.awayTeam,
    homeGoals: match.homeGoals,
    awayGoals: match.awayGoals,
    homeExtraTimeGoals: match.homeExtraTimeGoals,
    awayExtraTimeGoals: match.awayExtraTimeGoals,
    homePenaltyGoals: match.homePenaltyGoals,
    awayPenaltyGoals: match.awayPenaltyGoals,
    date: match.date,
    onlyDate: match.date ? match.date.toLocaleString() : "",
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

export function switchLeagueMatchesToNeutralMatches(
  matches: LeagueMatchProps[]
) {
  const neutralMatches: NeutralMatch[] = [];

  matches.forEach((match) => {
    neutralMatches.push(switchLeagueMatchToNeutralMatch(match));
  });

  return neutralMatches;
}

export function switchLeagueMatchToNeutralMatch(match: LeagueMatchProps) {
  const neutralMatch: NeutralMatch = {
    dbId: match.id,
    id: crypto.randomUUID(),
    type: "LEAGUE",
    season: match.season,
    tournamentEdition: null,
    tournamentOrLeagueName: match.season.league.name,
    tournamentOrLeagueYear: match.season.year,
    country: match.season.league.country
      ? match.season.league.country?.name
      : match.season.league.type,
    fullTournamentName: `${match.season.league.name} (${match.season.year})`,
    homeTeam: match.homeTeam,
    awayTeam: match.awayTeam,
    homeGoals: match.homeGoals,
    awayGoals: match.awayGoals,
    date: match.date,
    onlyDate: match.date ? match.date.toLocaleString() : "",
    localDate: match.date ? match.date?.toLocaleString() : null,
    localDateOnlyDate: match.date
      ? match.date?.toLocaleString().split(",")[0]
      : null,
    localTime: match.date
      ? match.date?.toLocaleString("en-US", { hour12: false }).split(",")[1]
      : null,
    group: null,
    round: match.round,
    stage: match.round || "",
  };

  return neutralMatch;
}
