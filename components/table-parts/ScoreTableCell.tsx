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
  leagueName,
  seasonName,
  roundName,
  groupName,
  date,
  homeGoals,
  awayGoals,
  homeExtraTimeGoals,
  awayExtraTimeGoals,
  homePenaltyGoals,
  awayPenaltyGoals,
  isKnockout,
}: {
  id: number;
  homeTeamName: string;
  awayTeamName: string;
  leagueName: string;
  seasonName: string;
  roundName: string;
  groupName: string;
  date: string;
  homeGoals: number | null;
  awayGoals: number | null;
  homeExtraTimeGoals: number | null;
  awayExtraTimeGoals: number | null;
  homePenaltyGoals: number | null;
  awayPenaltyGoals: number | null;
  isKnockout: boolean;
}) {
  const mainTimeGoals =
    homeGoals && awayGoals ? `${homeGoals} - ${awayGoals}` : null;

  const extraTimeGoals =
    homeExtraTimeGoals && awayExtraTimeGoals
      ? `${homeExtraTimeGoals} - ${awayExtraTimeGoals}`
      : null;

  const penaltyTimeGoals =
    homePenaltyGoals && awayPenaltyGoals
      ? `${homePenaltyGoals} - ${awayPenaltyGoals}`
      : null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <PopoverMatchScoreUpdator
            id={id}
            homeTeamName={homeTeamName}
            awayTeamName={awayTeamName}
            leagueName={leagueName}
            seasonName={seasonName}
            roundName={roundName}
            groupName={groupName}
            date={date}
            homeGoals={homeGoals}
            awayGoals={awayGoals}
            homeExtraTimeGoals={homeExtraTimeGoals}
            awayExtraTimeGoals={awayExtraTimeGoals}
            homePenaltyGoals={homePenaltyGoals}
            awayPenaltyGoals={awayPenaltyGoals}
            isKnockout={isKnockout}
          >
            <span className="hover:underline">
              {mainTimeGoals ? (
                <NotProvidedSpan hover={true}>#NP</NotProvidedSpan>
              ) : (
                <>
                  <span>{mainTimeGoals}</span>
                  {isKnockout ? (
                    extraTimeGoals && penaltyTimeGoals ? (
                      <>
                        <span>{`ET: ${extraTimeGoals}`}</span>
                        <span>{`PT: ${penaltyTimeGoals}`}</span>
                      </>
                    ) : extraTimeGoals ? (
                      <span>{`ET: ${extraTimeGoals}`}</span>
                    ) : (
                      <></>
                    )
                  ) : (
                    <></>
                  )}
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
