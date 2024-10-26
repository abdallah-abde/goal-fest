import {
  Country,
  Group,
  Team,
  TournamentEdition,
  Tournament,
  LeagueSeason,
  League,
  LeagueTeam,
  LeagueGroup,
} from "@prisma/client";

// export interface Tournament {
//   id: number;
//   name: string;
//   logoUrl?: string;
//   tournamentEditions: TournamentEdition[];
// }

// export interface TournamentEdition {
//   id: number;
//   year: number;
//   logoUrl?: string;
//   tournamentId: number;
//   tournament: Tournament;
//   groups: Group[];
//   knockoutMatches: KnockoutMatch[];
//   matches: Match[];
//   teams: Team[];
//   hostingCountries: Country[];
//   winner?: Team;
//   winnerId?: number;
// }

// export interface Group {
//   id: number;
//   name: string;
//   tournamentEditionId: number;
//   tournamentEdition: TournamentEdition;
//   teams: Team[];
//   matches: Match[];
// }

// export interface Team {
//   id: number;
//   name: string;
//   flagUrl?: string;
//   groups: Group[];
//   tournamentEdition: TournamentEdition[];
//   tournamentEditionWinner: TournamentEdition[];
//   matchesHome: Match[];
//   matchesAway: Match[];
//   knockoutMatchesHome: KnockoutMatch[];
//   knockoutMatchesAway: KnockoutMatch[];
//   //   players: Player[];
// }

// export interface Country {
//   id: number;
//   name: string;
//   flagUrl?: string;
//   tournamentEditions: TournamentEdition[];
// }

// export interface Match {
//   id: number;
//   homeTeam: Team;
//   homeTeamId: number;
//   awayTeam: Team;
//   awayTeamId: number;
//   homeGoals?: number;
//   awayGoals?: number;
//   date?: Date;
//   groupId: number;
//   group: Group;
//   tournamentEditionId: number;
//   tournamentEdition: TournamentEdition;
//   round?: string;
// }

// export interface KnockoutMatch {
//   id: number;
//   homeTeam?: Team;
//   homeTeamId?: number;
//   awayTeam?: Team;
//   awayTeamId?: number;
//   homeGoals?: number;
//   awayGoals?: number;
//   homeExtraTimeGoals?: number;
//   awayExtraTimeGoals?: number;
//   homePenaltyGoals?: number;
//   awayPenaltyGoals?: number;
//   date?: Date;
//   tournamentEditionId: number;
//   tournamentEdition: TournamentEdition;
//   round?: string;
//   homeTeamPlacehlder?: string;
//   awayTeamPlacehlder?: string;
// }

// export interface Player {
//   id: number;
//   name: string;
//   position?: string;
//   teamId: number;
// }

export interface TeamStats {
  played: number;
  won: number;
  lost: number;
  draw: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface TeamWithStats extends Team {
  stats: TeamStats;
}

export interface GroupWithTeams extends Group {
  teams: TeamWithStats[];
}

export interface LeagueTeamWithStats extends LeagueTeam {
  stats: TeamStats;
}

export interface LeagueGroupWithTeams extends LeagueGroup {
  teams: LeagueTeamWithStats[];
}

export interface StandingTeams extends LeagueTeam {
  stats: TeamStats;
}

export interface TournamentEditionProps extends TournamentEdition {
  tournament: Tournament;
  teams: Team[];
  winner: Team | null;
  titleHolder: Team | null;
  hostingCountries: Country[];
}

interface LeagueProps extends League {
  country: Country | null;
}

interface LeagueSeasonProps extends LeagueSeason {
  league: LeagueProps;
}

export interface NeutralMatch {
  dbId: number;
  id: string;
  type: "GROUP" | "KNOCKOUT" | "LEAGUE";
  tournamentEdition: TournamentEditionProps | null;
  season: LeagueSeasonProps | null;
  tournamentOrLeagueName: String;
  tournamentOrLeagueYear: String;
  country: String;
  fullTournamentName: String;
  homeTeam?: Team | LeagueTeam | null; // Not null in matches just in knockout
  awayTeam?: Team | LeagueTeam | null; // Not null in matches just in knockout
  homeGoals?: number | null;
  awayGoals?: number | null;
  homeExtraTimeGoals?: number | null; // Not existed in matches just in knockout
  awayExtraTimeGoals?: number | null; // Not existed in matches just in knockout
  homePenaltyGoals?: number | null; // Not existed in matches just in knockout
  awayPenaltyGoals?: number | null; // Not existed in matches just in knockout
  date?: Date | null;
  onlyDate?: string | null;
  localDate?: string | null;
  localTime?: string | null;
  localDateOnlyDate?: string | null;
  group?: Group | null; // Not existed in knockout just in matches
  round?: string | null;
  homeTeamPlaceholder?: string | null; // Not existed in matches just in knockout
  awayTeamPlaceholder?: string | null; // Not existed in matches just in knockout
  stage: string; // Not existed in matches or knockout
  status: string | null;
}
