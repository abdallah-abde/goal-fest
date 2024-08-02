import { Group as PrismaGroup, Team as PrismaTeam } from "@prisma/client";

export interface Tournament {
  id: number;
  name: string;
  logoUrl?: string;
  tournamentEditions: TournamentEdition[];
}

export interface TournamentEdition {
  id: number;
  year: number;
  logoUrl?: string;
  tournamentId: number;
  tournament: Tournament;
  groups: Group[];
  knockoutMatches: KnockoutMatch[];
  matches: Match[];
  teams: Team[];
  hostingCountries: Country[];
  winner?: Team;
  winnerId?: number;
}

export interface Group {
  id: number;
  name: string;
  tournamentEditionId: number;
  tournamentEdition: TournamentEdition;
  teams: Team[];
  matches: Match[];
}

export interface Team {
  id: number;
  name: string;
  flagUrl?: string;
  groups: Group[];
  tournamentEdition: TournamentEdition[];
  tournamentEditionWinner: TournamentEdition[];
  matchesHome: Match[];
  matchesAway: Match[];
  knockoutMatchesHome: KnockoutMatch[];
  knockoutMatchesAway: KnockoutMatch[];
  //   players: Player[];
}

export interface Country {
  id: number;
  name: string;
  flagUrl?: string;
  tournamentEditions: TournamentEdition[];
}

export interface Match {
  id: number;
  homeTeam: Team;
  homeTeamId: number;
  awayTeam: Team;
  awayTeamId: number;
  homeGoals?: number;
  awayGoals?: number;
  date?: Date;
  groupId: number;
  group: Group;
  tournamentEditionId: number;
  tournamentEdition: TournamentEdition;
  round?: string;
}

export interface KnockoutMatch {
  id: number;
  homeTeam?: Team;
  homeTeamId?: number;
  awayTeam?: Team;
  awayTeamId?: number;
  homeGoals?: number;
  awayGoals?: number;
  homeExtraTimeGoals?: number;
  awayExtraTimeGoals?: number;
  homePenaltyGoals?: number;
  awayPenaltyGoals?: number;
  date?: Date;
  tournamentEditionId: number;
  tournamentEdition: TournamentEdition;
  round?: string;
  homeTeamPlacehlder?: string;
  awayTeamPlacehlder?: string;
}

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

export interface TeamWithStats extends PrismaTeam {
  stats: TeamStats;
}

export interface Player {
  id: number;
  name: string;
  position?: string;
  teamId: number;
}

export interface GroupWithTeams extends PrismaGroup {
  teams: TeamWithStats[];
}
