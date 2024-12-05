import Image from "next/image";

import { NeutralMatch } from "@/types";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import CardsSectionContainer from "@/components/lists/cards/templates/CardsSectionContainer";

import { getFormattedDate, getFormattedTime } from "@/lib/getFormattedDate";
import { EmptyImageUrls } from "@/types/enums";

export default function NextMatches({
  allMatches,
}: {
  allMatches: NeutralMatch[];
}) {
  return (
    <>
      {allMatches && allMatches.length > 0 && (
        <CardsSectionContainer label="Next Matches">
          {allMatches.map(
            ({
              id,
              date,
              homeTeam,
              awayTeam,
              homeTeamPlaceholder,
              awayTeamPlaceholder,
              group,
              round,
            }) => (
              <Card key={id}>
                <CardContent className="flex flex-col gap-2 text-sm p-6 py-3">
                  <div className="flex items-center justify-between">
                    {date && (
                      <>
                        <Badge
                          variant="green"
                          className="text-[10px] leading-3 sm:text-xs"
                        >
                          {getFormattedDate(date.toISOString(), true)}
                        </Badge>
                        <Badge
                          variant="green"
                          className="text-[10px] leading-3 sm:text-xs"
                        >
                          {getFormattedTime(date.toISOString(), true)}
                        </Badge>
                      </>
                    )}
                  </div>
                  <div className="flex flex-col gap-0 border-y border-primary/10">
                    <div className="flex items-center gap-2 py-2">
                      <Image
                        src={homeTeam?.flagUrl || EmptyImageUrls.Team}
                        alt={homeTeam?.name + " Flag" || "Team Flag"}
                        width={35}
                        height={35}
                        className="aspect-video object-contain"
                      />
                      <span className="hidden sm:block font-bold">
                        {homeTeam ? homeTeam.name : homeTeamPlaceholder}
                      </span>
                      <span className="hidden max-sm:block font-bold">
                        {homeTeam ? homeTeam.code : homeTeamPlaceholder}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 py-2">
                      <Image
                        src={awayTeam?.flagUrl || EmptyImageUrls.Team}
                        alt={awayTeam?.name + " Flag" || "Team Flag"}
                        width={35}
                        height={35}
                        className="aspect-video object-contain"
                      />
                      <span className="hidden sm:block font-bold">
                        {awayTeam ? awayTeam.name : awayTeamPlaceholder}
                      </span>
                      <span className="hidden max-sm:block font-bold">
                        {awayTeam ? awayTeam.code : awayTeamPlaceholder}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    {group && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] leading-3 sm:text-xs"
                      >
                        {group.name}
                      </Badge>
                    )}
                    {round && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] leading-3 sm:text-xs"
                      >
                        {round}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          )}
        </CardsSectionContainer>
      )}
    </>
  );
}
