export interface Team {
  id: number;
  name: string;
  matchesHome: Match[];
  matchesAway: Match[];
  groupId: number;
  group: Group;
  //   flagUrl?: string;
  //   players: Player[];
  //   tournaments: Tournament[];
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

export interface TeamWithStats extends Team {
  stats: TeamStats;
}

export interface Player {
  id: number;
  name: string;
  position?: string;
  teamId: number;
}

export interface Tournament {
  id: number;
  name: string;
  logoUrl?: string;
  groups: Group[];
  knockoutMatches: KnockoutMatch[];
}

export interface Group {
  id: number;
  name: string;
  teams: Team[];
}

export interface GroupWithTeams {
  id: number;
  name: string;
  teams: TeamWithStats[];
}

export interface Match {
  id: number;
  homeTeamId: number;
  homeTeam: Team;
  awayTeamId: number;
  awayTeam: Team;
  homeGoals: number;
  awayGoals: number;
  date: Date;
}

export interface KnockoutMatch {
  id: number;
  tournamentId: number;
  tournament: Tournament;
  round: string;
  homeTeamId?: number;
  homeTeam?: Team;
  awayTeamId?: number;
  awayTeam?: Team;
  homeGoals?: number;
  awayGoals?: number;
  homeExtraTimeGoals?: number;
  awayExtraTimeGoals?: number;
  homePenaltyGoals?: number;
  awayPenaltyGoals?: number;
  date: Date;
}
