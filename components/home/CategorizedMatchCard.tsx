import Image from "next/image";

import { NeutralMatch } from "@/types";

import { getFormattedTime } from "@/lib/getFormattedDate";

export default function CategorizedMatchCard({
  match,
}: {
  match: NeutralMatch;
}) {
  return (
    <div className="first:border-t-2 border-primary/25 border-b-2 bg-primary/20">
      <div className="flex items-center gap-4 p-2 py-6 relative">
        <p className="flex-1 text-right text-sm">
          {match.homeTeam?.name || ""}
        </p>
        {match.homeTeam && match.homeTeam.flagUrl && (
          <Image
            width={25}
            height={25}
            src={match.homeTeam.flagUrl || ""}
            alt="team"
          />
        )}
        <>
          {match.status && (
            <>
              <p className="text-muted-foreground text-xs absolute top-1 left-0 right-0 text-center">
                {match.status === "Ended" &&
                match.homePenaltyGoals != null &&
                match.awayPenaltyGoals != null
                  ? "After Penalties"
                  : match.status === "Ended" &&
                    match.homeExtraTimeGoals != null &&
                    match.awayExtraTimeGoals != null
                  ? "After Extra Time"
                  : match.status}
              </p>

              <p className="text-muted-foreground text-xs absolute bottom-1 left-0 right-0 text-center">
                {match.status === "Ended" &&
                match.homePenaltyGoals != null &&
                match.awayPenaltyGoals != null
                  ? match.homePenaltyGoals > match.awayPenaltyGoals
                    ? `${match.homeTeam?.name} has won ${match.homePenaltyGoals}-${match.awayPenaltyGoals} after penalties`
                    : match.homePenaltyGoals < match.awayPenaltyGoals
                    ? `${match.awayTeam?.name} has won ${match.awayPenaltyGoals}-${match.homePenaltyGoals} after penalties`
                    : ""
                  : ""}
              </p>
            </>
          )}{" "}
          {/* Ended, Postponed, Cancelled, Playing */}
          {(!match.status ||
            match.status === "Postponed" ||
            match.status === "Cancelled") && (
            <p className="font-semibold text-sm">
              {(match.date &&
                getFormattedTime(match.date?.toString(), true, false)) ||
                ""}
            </p>
          )}
          {match.status &&
            (match.status === "Ended" || match.status === "Playing") &&
            match.homeGoals != null &&
            match.awayGoals != null && (
              <p className="flex gap-2">
                <span>
                  {match.homeExtraTimeGoals != null
                    ? match.homeGoals + match.homeExtraTimeGoals
                    : match.homeGoals}
                </span>{" "}
                -{" "}
                <span>
                  {match.awayExtraTimeGoals != null
                    ? match.awayGoals + match.awayExtraTimeGoals
                    : match.awayGoals}
                </span>
              </p>
            )}
        </>

        {match.awayTeam && match.awayTeam.flagUrl && (
          <Image
            width={25}
            height={25}
            src={match.awayTeam.flagUrl || ""}
            alt="team"
          />
        )}
        <p className="flex-1 text-sm">{match.awayTeam?.name || ""}</p>
      </div>
    </div>
  );
}
