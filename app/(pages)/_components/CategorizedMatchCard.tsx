import Image from "next/image";

import { MatchProps } from "@/types";

import { getFormattedTime } from "@/lib/getFormattedDate";
import { EmptyImageUrls, MatchStatusOptions } from "@/types/enums";

export default function CategorizedMatchCard({ match }: { match: MatchProps }) {
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

  console.log(homeTeam);

  return (
    <div className="first:border-t-2 border-primary/25 border-b-2 bg-primary/20">
      <div className="flex items-center gap-4 p-2 py-6 relative">
        <p className="hidden xs:inline-block lg:hidden xl:inline-block flex-1 text-right text-sm">
          {homeTeam?.name || ""}
        </p>
        <p className="hidden max-xs:inline-block lg:inline-block xl:hidden flex-1 text-right text-sm">
          {homeTeam?.code || homeTeam?.name || ""}
        </p>
        <Image
          width={50}
          height={50}
          src={homeTeam?.flagUrl || EmptyImageUrls.Team}
          alt={`${homeTeam?.name} flag` || "Team flag"}
          className="hidden max-xs:block aspect-video object-contain"
        />
        <Image
          width={75}
          height={75}
          src={homeTeam?.flagUrl || EmptyImageUrls.Team}
          alt={`${homeTeam?.name} flag` || "Team flag"}
          className="hidden xs:block md:hidden lg:inline-block xl:hidden aspect-video object-contain"
        />
        <Image
          width={100}
          height={100}
          src={homeTeam?.flagUrl || EmptyImageUrls.Team}
          alt={`${homeTeam?.name} flag` || "Team flag"}
          className="hidden md:block lg:hidden xl:inline-block aspect-video object-contain"
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
          width={50}
          height={50}
          src={awayTeam?.flagUrl || EmptyImageUrls.Team}
          alt={`${awayTeam?.name} flag` || "Team flag"}
          className="hidden max-xs:block aspect-video object-contain"
        />
        <Image
          width={75}
          height={75}
          src={awayTeam?.flagUrl || EmptyImageUrls.Team}
          alt={`${awayTeam?.name} flag` || "Team flag"}
          className="hidden xs:block md:hidden lg:inline-block xl:hidden aspect-video object-contain"
        />
        <Image
          width={100}
          height={100}
          src={awayTeam?.flagUrl || EmptyImageUrls.Team}
          alt={`${awayTeam?.name} flag` || "Team flag"}
          className="hidden md:block lg:hidden xl:inline-block aspect-video object-contain"
        />
        <p className="hidden xs:inline-block lg:hidden xl:inline-block flex-1 text-left text-sm">
          {awayTeam?.name || ""}
        </p>
        <p className="hidden max-xs:inline-block lg:inline-block xl:hidden flex-1 text-left text-sm">
          {awayTeam?.code || awayTeam?.name || ""}
        </p>
      </div>
    </div>
  );
}
