import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import PopoverMatchScoreUpdator from "@/components/table-parts/PopoverMatchScoreUpdator";
import NotProvidedSpan from "@/components/NotProvidedSpan";

export default function ScoreTableCell({
  id,
  homeTeamName,
  awayTeamName,
  tournamentName,
  editionName,
  roundName,
  groupName,
  date,
  homeGoals,
  awayGoals,
  type,
}: {
  id: number;
  homeTeamName: string;
  awayTeamName: string;
  tournamentName: string;
  editionName: string;
  roundName: string;
  groupName: string;
  date: string;
  homeGoals: number | null;
  awayGoals: number | null;
  type: "matches" | "leagueMatches";
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <PopoverMatchScoreUpdator
            id={id}
            homeTeamName={homeTeamName}
            awayTeamName={awayTeamName}
            tournamentName={tournamentName}
            editionName={editionName}
            roundName={roundName}
            groupName={groupName}
            date={date}
            homeGoals={homeGoals}
            awayGoals={awayGoals}
            type={type}
          >
            <span className="hover:underline">
              {!homeGoals && !awayGoals ? (
                <NotProvidedSpan hover={true}>#NP</NotProvidedSpan>
              ) : (
                <>
                  {homeGoals} - {awayGoals}
                </>
              )}
            </span>
          </PopoverMatchScoreUpdator>
        </TooltipTrigger>
        <TooltipContent>
          <p>Click to update score</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
