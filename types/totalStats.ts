export interface TournamentTotalGoalsProps {
  teamId: number;
  teamName: string;
  teamCode: string;
  teamFlagUrl: string;
  groupMatchesGoals: number;
  knockoutMatchesGoals: number;
}

export interface LeagueTotalGoalsProps {
  teamId: number;
  teamName: string;
  teamCode: string;
  teamFlagUrl: string;
  matchesGoals: number;
}

export interface TournamentTotalCleanSheetsProps {
  teamId: number;
  teamName: string;
  teamCode: string;
  teamFlagUrl: string;
  groupMatchesCleanSheets: number;
  knockoutMatchesCleanSheets: number;
}

export interface LeagueTotalCleanSheetsProps {
  teamId: number;
  teamName: string;
  teamCode: string;
  teamFlagUrl: string;
  matchesCleanSheets: number;
}
