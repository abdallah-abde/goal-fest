import {
  Country as PrismaCountry,
  Group as PrismaGroup,
  Team as PrismaTeam,
  TournamentEdition as PrismaTournamentEdition,
  Match as PrismaMatch,
  KnockoutMatch as PrismaKnockoutMatch,
  Tournament as PrismaTournament,
  LeagueSeason as PrismaLeagueSeason,
  League as PrismaLeague,
  LeagueTeam as PrismaLeagueTeam,
} from "@prisma/client";

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

export interface NeutralMatch {
  dbId: number;
  id: string;
  type: "GROUP" | "KNOCKOUT" | "LEAGUE";
  tournamentEdition:
    | (PrismaTournamentEdition & {
        tournament: PrismaTournament;
        hostingCountries: PrismaCountry[];
      })
    | null;
  season:
    | (PrismaLeagueSeason & {
        league: PrismaLeague & { country: PrismaCountry | null };
      })
    | null;
  tournamentOrLeagueName: String;
  tournamentOrLeagueYear: String;
  country: String;
  fullTournamentName: String;
  homeTeam?: PrismaTeam | PrismaLeagueTeam | null; // Not null in matches just in knockout
  awayTeam?: PrismaTeam | PrismaLeagueTeam | null; // Not null in matches just in knockout
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
  group?: PrismaGroup | null; // Not existed in knockout just in matches
  round?: string | null;
  homeTeamPlaceholder?: string | null; // Not existed in matches just in knockout
  awayTeamPlaceholder?: string | null; // Not existed in matches just in knockout
  stage: string; // Not existed in matches or knockout
}
