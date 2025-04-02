import { Country, Group, Team, Season, League } from "@prisma/client";

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

export interface StandingTeams extends Team {
  stats: TeamStats;
}

interface LeagueProps extends League {
  country: Country | null;
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
    code: string | undefined;
  };
  homeTeam: {
    flagUrl?: string | null | undefined;
    name: string;
    code: string | undefined;
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
