export interface Team {
  id: number;
  name: string;
  matchesHome: Match[];
  matchesAway: Match[];
  knockoutMatchesHome: KnockoutMatch[];
  knockoutMatchesAway: KnockoutMatch[];
  groups: Group[];
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
  tournamentEdition: TournamentEdition[];
  logoUrl?: string;
}

export interface TournamentEdition {
  id: number;
  year: number;
  logoUrl?: string;
  tournamentId: number;
  tournament: Tournament;
  groups: Group[];
  matches: Match[];
  knockoutMatches: KnockoutMatch[];
  teams: Team[];
}

export interface Group {
  id: number;
  name: string;
  tournamentEditionId: number;
  tournamentEdition: TournamentEdition;
  teams: Team[];
  matches: Match[];
}

export interface GroupWithTeams {
  id: number;
  name: string;
  tournamentEditionId: number;
  tournamentEdition: TournamentEdition;
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
  groupId: number;
  group: Group;
  tournamentEditionId: number;
  tournamentEdition: TournamentEdition;
}

export interface KnockoutMatch {
  id: number;
  round: string;
  homeTeamId: number;
  homeTeam: Team;
  awayTeamId: number;
  awayTeam: Team;
  homeGoals: number;
  awayGoals: number;
  date: Date;
  tournamentEditionId: number;
  tournamentEdition: TournamentEdition;
}
