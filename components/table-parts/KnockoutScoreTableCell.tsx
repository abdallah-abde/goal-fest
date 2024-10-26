import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import PopoverKnockoutMatchScoreUpdator from "@/components/table-parts/PopoverKnockoutMatchScoreUpdator";
import NotProvidedSpan from "@/components/NotProvidedSpan";

export default function KnockoutScoreTableCell({
  id,
  homeTeamName,
  awayTeamName,
  tournamentName,
  editionName,
  roundName,
  date,
  homeGoals,
  awayGoals,
  homeExtraTimeGoals,
  awayExtraTimeGoals,
  homePenaltyGoals,
  awayPenaltyGoals,
  scoreTime,
  type,
}: {
  id: number;
  homeTeamName: string;
  awayTeamName: string;
  tournamentName: string;
  editionName: string;
  roundName: string;
  date: string;
  homeGoals: number | null;
  awayGoals: number | null;
  homeExtraTimeGoals?: number | null;
  awayExtraTimeGoals?: number | null;
  homePenaltyGoals?: number | null;
  awayPenaltyGoals?: number | null;
  scoreTime: "MT" | "ET" | "PT";
  type: "knockoutMatches" | "leagueKnockoutMatches";
}) {
  const condition =
    scoreTime === "MT"
      ? homeGoals === null && awayGoals === null
      : scoreTime === "ET"
      ? homeExtraTimeGoals === null && awayExtraTimeGoals === null
      : homePenaltyGoals === null && awayPenaltyGoals === null;

  const score =
    scoreTime === "MT"
      ? `${homeGoals} - ${awayGoals}`
      : scoreTime === "ET"
      ? `${homeExtraTimeGoals} - ${awayExtraTimeGoals}`
      : `${homePenaltyGoals} - ${awayPenaltyGoals}`;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <PopoverKnockoutMatchScoreUpdator
            id={id}
            homeTeamName={homeTeamName || ""}
            awayTeamName={awayTeamName || ""}
            tournamentName={tournamentName}
            editionName={editionName}
            roundName={roundName || ""}
            date={date}
            homeGoals={homeGoals}
            awayGoals={awayGoals}
            homeExtraTimeGoals={homeExtraTimeGoals}
            awayExtraTimeGoals={awayExtraTimeGoals}
            homePenaltyGoals={homePenaltyGoals}
            awayPenaltyGoals={awayPenaltyGoals}
            type={type}
          >
            <span className="hover:underline">
              {condition ? (
                <NotProvidedSpan hover={true}>#NP</NotProvidedSpan>
              ) : (
                <>{score}</>
              )}
            </span>
          </PopoverKnockoutMatchScoreUpdator>
        </TooltipTrigger>
        <TooltipContent>
          <p>Click to update score</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
