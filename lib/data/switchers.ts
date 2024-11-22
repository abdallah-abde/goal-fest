import { NeutralMatch } from "@/types";
import { EmptyImageUrls } from "@/types/enums";
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
  LeagueKnockoutMatch,
  LeagueGroup,
} from "@prisma/client";

interface TournamentEditionProps extends TournamentEdition {
  tournament: Tournament;
  teams: Team[];
  groups: Group[];
  winner: Team | null;
  titleHolder: Team | null;
  hostingCountries: Country[];
  // matches: MatchProps[];
  // knockoutMatches: KnockoutMatchProps[];
}

interface MatchProps extends Match {
  group: Group;
  homeTeam: Team;
  awayTeam: Team;
  tournamentEdition: TournamentEditionProps;
}

interface KnockoutMatchProps extends KnockoutMatch {
  homeTeam: Team | null;
  awayTeam: Team | null;
  tournamentEdition: TournamentEditionProps;
}

interface LeagueProps extends League {
  country: Country | null;
}

interface LeagueSeasonProps extends LeagueSeason {
  league: LeagueProps;
  teams: LeagueTeam[];
  groups: LeagueGroup[];
  winner: LeagueTeam | null;
  titleHolder: LeagueTeam | null;
}

interface LeagueMatchProps extends LeagueMatch {
  group: LeagueGroup | null;
  homeTeam: LeagueTeam;
  awayTeam: LeagueTeam;
  season: LeagueSeasonProps;
}

interface LeagueKnockoutMatchProps extends LeagueKnockoutMatch {
  homeTeam: LeagueTeam | null;
  awayTeam: LeagueTeam | null;
  season: LeagueSeasonProps;
}

export function switchTournamentMatchesToNeutralMatches(matches: MatchProps[]) {
  const neutralMatches: NeutralMatch[] = [];

  matches.forEach((match) => {
    neutralMatches.push(switchTournamentMatchToNeutralMatch(match));
  });

  return neutralMatches;
}

export function switchTournamentMatchToNeutralMatch(match: MatchProps) {
  const neutralMatch: NeutralMatch = {
    dbId: match.id,
    id: crypto.randomUUID(),
    type: "TOURNAMENT_MATCH",
    editionOrSeason: match.tournamentEdition,
    editionOrSeasonLogoUrl:
      match.tournamentEdition.logoUrl ||
      match.tournamentEdition.tournament.logoUrl ||
      EmptyImageUrls.Tournament,
    editionOrSeasonSlug: match.tournamentEdition.slug,
    tournamentOrLeagueName: match.tournamentEdition.tournament.name,
    tournamentOrLeagueYear: match.tournamentEdition.year,
    country: match.tournamentEdition.tournament.type,
    countryflagUrl: EmptyImageUrls.Country,
    fullTournamentName: `${match.tournamentEdition.tournament.name} (${match.tournamentEdition.year})`,
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
    status: match.status,
    matchOf: "tournaments",
  };

  return neutralMatch;
}

export function switchTournamentKnockoutMatchesToNeutralMatches(
  matches: KnockoutMatchProps[]
) {
  const neutralMatches: NeutralMatch[] = [];

  matches.forEach((match) => {
    neutralMatches.push(switchTournamentKnockoutMatchToNeutralMatch(match));
  });

  return neutralMatches;
}

export function switchTournamentKnockoutMatchToNeutralMatch(
  match: KnockoutMatchProps
) {
  const neutralMatch: NeutralMatch = {
    dbId: match.id,
    id: crypto.randomUUID(),
    type: "LEAGUE_KNOCKOUT_MATCH",
    editionOrSeason: match.tournamentEdition,
    editionOrSeasonLogoUrl:
      match.tournamentEdition.logoUrl ||
      match.tournamentEdition.tournament.logoUrl ||
      EmptyImageUrls.Tournament,
    editionOrSeasonSlug: match.tournamentEdition.slug,
    tournamentOrLeagueName: match.tournamentEdition
      ? match.tournamentEdition.tournament
        ? match.tournamentEdition.tournament.name
        : ""
      : "",
    tournamentOrLeagueYear: match.tournamentEdition.year,
    country: match.tournamentEdition
      ? match.tournamentEdition.tournament
        ? match.tournamentEdition.tournament.type
        : ""
      : "",
    countryflagUrl: EmptyImageUrls.Country,
    fullTournamentName: `${
      match.tournamentEdition
        ? match.tournamentEdition.tournament
          ? match.tournamentEdition.tournament.name
          : ""
        : ""
    } (${match.tournamentEdition.year})`,
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
    status: match.status,
    matchOf: "tournaments",
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
    type: "LEAGUE_MATCH",
    editionOrSeason: match.season,
    editionOrSeasonLogoUrl:
      match?.season?.logoUrl ||
      match?.season?.league?.logoUrl ||
      EmptyImageUrls.Tournament,
    editionOrSeasonSlug: match.season.slug,
    tournamentOrLeagueName: match.season?.league?.name,
    tournamentOrLeagueYear: match.season?.year,
    country: match.season?.league?.country
      ? match.season?.league?.country?.name
      : match.season?.league?.type,
    countryflagUrl:
      match.season?.league?.country?.flagUrl || EmptyImageUrls.Country,
    fullTournamentName: `${match.season?.league?.name} (${match.season?.year})`,
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
    stage: match.round || "",
    status: match.status,
    awayTeamPlaceholder: "",
    homeTeamPlaceholder: "",
    matchOf: "leagues",
  };

  return neutralMatch;
}

export function switchLeagueKnockoutMatchesToNeutralMatches(
  matches: LeagueKnockoutMatchProps[]
) {
  const neutralMatches: NeutralMatch[] = [];

  matches.forEach((match) => {
    neutralMatches.push(switchLeagueKnockoutMatchToNeutralMatch(match));
  });

  return neutralMatches;
}

export function switchLeagueKnockoutMatchToNeutralMatch(
  match: LeagueKnockoutMatchProps
) {
  const neutralMatch: NeutralMatch = {
    dbId: match.id,
    id: crypto.randomUUID(),
    type: "LEAGUE_KNOCKOUT_MATCH",
    editionOrSeason: match.season,
    editionOrSeasonLogoUrl:
      match.season.logoUrl ||
      match.season.league.logoUrl ||
      EmptyImageUrls.Tournament,
    editionOrSeasonSlug: match.season.slug,
    tournamentOrLeagueName: match.season?.league?.name,
    tournamentOrLeagueYear: match.season?.year,
    country: match.season?.league?.country
      ? match.season?.league?.country?.name
      : match.season?.league?.type,
    countryflagUrl:
      match.season?.league?.country?.flagUrl || EmptyImageUrls.Country,
    fullTournamentName: `${match.season?.league?.name} (${match.season?.year})`,
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
    stage: match.round || "",
    status: match.status,
    awayTeamPlaceholder: match.homeTeamPlacehlder,
    homeTeamPlaceholder: match.awayTeamPlacehlder,
    matchOf: "leagues",
  };

  return neutralMatch;
}
