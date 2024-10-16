import CardsSectionContainer from "@/components/lists/cards/templates/CardsSectionContainer";
import TotalCleanSheetsCard from "@/components/lists/cards/stats/TotalCleanSheetsCards";
import TotalGoalsCard from "@/components/lists/cards/stats/TotalGoalsCard";

import {
  TournamentTotalCleanSheetsProps,
  TournamentTotalGoalsProps,
} from "@/types/totalStats";

export default function TeamsStats({
  label,
  teamsGoalsScored,
  teamsGoalsAgainst,
  teamsCleanSheets,
}: {
  label?: string | null;
  teamsGoalsScored: TournamentTotalGoalsProps[];
  teamsGoalsAgainst: TournamentTotalGoalsProps[];
  teamsCleanSheets: TournamentTotalCleanSheetsProps[];
}) {
  return (
    <>
      {(teamsGoalsScored.length > 0 ||
        teamsGoalsAgainst.length > 0 ||
        teamsCleanSheets.length > 0) && (
        <CardsSectionContainer label={label}>
          {teamsGoalsScored && (
            <TotalGoalsCard
              label="Most goals scored"
              teamsGoals={teamsGoalsScored}
            />
          )}
          {teamsGoalsAgainst && (
            <TotalGoalsCard
              label="Most goals conceded"
              teamsGoals={teamsGoalsAgainst}
            />
          )}
          {teamsCleanSheets && (
            <TotalCleanSheetsCard
              label="Most clean sheets"
              teamsCleanSheets={teamsCleanSheets}
            />
          )}
        </CardsSectionContainer>
      )}
    </>
  );
}
