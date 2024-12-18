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

export interface StandingLeagueTeams extends LeagueTeam {
  stats: TeamStats;
}

export interface StandingTeams extends Team {
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
  type:
    | "TOURNAMENT_MATCH"
    | "TOURNAMENT_KNOCKOUT_MATCH"
    | "LEAGUE_MATCH"
    | "LEAGUE_KNOCKOUT_MATCH";
  editionOrSeason: TournamentEditionProps | LeagueSeasonProps | null;
  // season: LeagueSeasonProps | null;
  editionOrSeasonLogoUrl: string;
  editionOrSeasonSlug: string;
  tournamentOrLeagueName: string;
  tournamentOrLeagueYear: string;
  country: string;
  countryflagUrl: string | null;
  fullTournamentName: string;
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
  group?: Group | LeagueGroup | null; // Not existed in knockout just in matches
  round?: string | null;
  homeTeamPlaceholder?: string | null; // Not existed in matches just in knockout
  awayTeamPlaceholder?: string | null; // Not existed in matches just in knockout
  stage: string; // Not existed in matches or knockout
  status: string | null;
  matchOf: "tournaments" | "leagues";
}

export interface TableHeadProps {
  labels: Array<{ name: string; className?: string | null }>;
  className: string;
}

export interface MatchProps {
  awayExtraTimeGoals?: number | null | undefined;
  homeExtraTimeGoals?: number | null | undefined;
  awayPenaltyGoals?: number | null | undefined;
  homePenaltyGoals?: number | null | undefined;
  awayGoals?: number | null | undefined;
  homeGoals?: number | null | undefined;
  awayTeamId: number;
  homeTeamId: number;
  awayTeam: {
    flagUrl?: string | null | undefined;
    name: string;
  };
  homeTeam: {
    flagUrl?: string | null | undefined;
    name: string;
  };
  date: Date;
  groupId?: number | null | undefined;
  group: {
    name: string;
  };
  round?: string | null | undefined;
  id: number;
  isFeatured: boolean;
  status?: string | null | undefined;
  season: {
    slug: string;
    hostingCountries: {
      name: string;
      id: true;
      flagUrl?: string | null | undefined;
    }[];
    flagUrl?: string | null | undefined;
    year: string;
    league: {
      name: string;
      country: {
        name: string;
        id: number;
        flagUrl?: string | null | undefined;
      };
    };
  };
}
