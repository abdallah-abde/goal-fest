import Image from "next/image";

import { NeutralMatch } from "@/types";

import { getFormattedTime } from "@/lib/getFormattedDate";
import { MatchStatusOptions } from "@/types/enums";

export default function CategorizedMatchCard({
  match,
}: {
  match: NeutralMatch;
}) {
  const {
    homeTeam,
    awayTeam,
    status,
    homePenaltyGoals,
    awayPenaltyGoals,
    homeExtraTimeGoals,
    awayExtraTimeGoals,
    date,
    homeGoals,
    awayGoals,
  } = match;

  return (
    <div className="first:border-t-2 border-primary/25 border-b-2 bg-primary/20">
      <div className="flex items-center gap-4 p-2 py-6 relative">
        <p className="flex-1 text-right text-sm">{homeTeam?.name || ""}</p>
        <Image
          width={80}
          height={80}
          src={homeTeam?.flagUrl || "/images/teams/team-empty-logo.png"}
          alt="team"
          className="aspect-video object-contain"
        />
        <>
          {status && (
            <>
              <p className="text-muted-foreground text-xs absolute top-1 left-0 right-0 text-center">
                {status === MatchStatusOptions.Ended &&
                homePenaltyGoals != null &&
                awayPenaltyGoals != null
                  ? "After Penalties"
                  : status === MatchStatusOptions.Ended &&
                    homeExtraTimeGoals != null &&
                    awayExtraTimeGoals != null
                  ? "After Extra Time"
                  : status}
              </p>

              <p className="text-muted-foreground text-xs absolute bottom-1 left-0 right-0 text-center">
                {status === MatchStatusOptions.Ended &&
                homePenaltyGoals != null &&
                awayPenaltyGoals != null
                  ? homePenaltyGoals > awayPenaltyGoals
                    ? `${homeTeam?.name} has won ${homePenaltyGoals}-${awayPenaltyGoals} after penalties`
                    : homePenaltyGoals < awayPenaltyGoals
                    ? `${awayTeam?.name} has won ${awayPenaltyGoals}-${homePenaltyGoals} after penalties`
                    : ""
                  : ""}
              </p>
            </>
          )}{" "}
          {/* Ended, Postponed, Cancelled, Playing */}
          {(!status ||
            status === MatchStatusOptions.Postponed ||
            status === MatchStatusOptions.Cancelled) && (
            <p className="font-semibold text-sm">
              {(date && getFormattedTime(date?.toString(), true, false)) || ""}
            </p>
          )}
          {status &&
            (status === MatchStatusOptions.Ended ||
              status === MatchStatusOptions.Playing) &&
            homeGoals != null &&
            awayGoals != null && (
              <p className="flex gap-2">
                <span>
                  {homeExtraTimeGoals != null
                    ? homeGoals + homeExtraTimeGoals
                    : homeGoals}
                </span>{" "}
                -{" "}
                <span>
                  {awayExtraTimeGoals != null
                    ? awayGoals + awayExtraTimeGoals
                    : awayGoals}
                </span>
              </p>
            )}
        </>

        <Image
          width={80}
          height={80}
          src={awayTeam?.flagUrl || "/images/teams/team-empty-logo.png"}
          alt="team"
          className="aspect-video object-contain"
        />
        <p className="flex-1 text-sm">{awayTeam?.name || ""}</p>
      </div>
    </div>
  );
}
