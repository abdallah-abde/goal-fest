import CardsSectionContainer from "@/components/lists/cards/templates/CardsSectionContainer";
import LeagueTotalCleanSheetsCard from "@/components/lists/cards/stats/LeagueTotalCleanSheetsCards";
import LeagueTotalGoalsCards from "@/components/lists/cards/stats/LeagueTotalGoalsCards";

import {
  LeagueTotalCleanSheetsProps,
  LeagueTotalGoalsProps,
} from "@/types/totalStats";

export default function LeagueTeamsStats({
  label,
  teamsGoalsScored,
  teamsGoalsAgainst,
  teamsCleanSheets,
}: {
  label?: string | null;
  teamsGoalsScored: LeagueTotalGoalsProps[];
  teamsGoalsAgainst: LeagueTotalGoalsProps[];
  teamsCleanSheets: LeagueTotalCleanSheetsProps[];
}) {
  return (
    <>
      {(teamsGoalsScored.length > 0 ||
        teamsGoalsAgainst.length > 0 ||
        teamsCleanSheets.length > 0) && (
        <CardsSectionContainer label={label}>
          {teamsGoalsScored && (
            <LeagueTotalGoalsCards
              label="Most goals scored"
              teamsGoals={teamsGoalsScored}
            />
          )}
          {teamsGoalsAgainst && (
            <LeagueTotalGoalsCards
              label="Most goals conceded"
              teamsGoals={teamsGoalsAgainst}
            />
          )}
          {teamsCleanSheets && (
            <LeagueTotalCleanSheetsCard
              label="Most clean sheets"
              teamsCleanSheets={teamsCleanSheets}
            />
          )}
        </CardsSectionContainer>
      )}
    </>
  );
}
