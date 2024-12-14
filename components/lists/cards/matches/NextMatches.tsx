import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import CardsSectionContainer from "@/components/lists/cards/templates/CardsSectionContainer";

import { getFormattedDate, getFormattedTime } from "@/lib/getFormattedDate";
import { EmptyImageUrls } from "@/types/enums";
import { Country, Group, League, Match, Season, Team } from "@prisma/client";

interface MatchProps extends Match {
  group: Group | null;
  homeTeam: Team | null;
  awayTeam: Team | null;
  // season: SeasonProps;
}

interface SeasonProps extends Season {
  league: LeagueProps;
  teams: Team[];
  groups: Group[];
  winner: Team | null;
  titleHolder: Team | null;
  matches: MatchProps[];
  hostingCountries: Country[];
}

interface LeagueProps extends League {
  country: Country | null;
}

export default function NextMatches({ matches }: { matches: MatchProps[] }) {
  return (
    <>
      {matches && matches.length > 0 && (
        <CardsSectionContainer label="Next Matches">
          {matches.map(
            ({
              id,
              date,
              homeTeam,
              awayTeam,
              // homeTeamPlaceholder,
              // awayTeamPlaceholder,
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
                        {/* {homeTeam ? homeTeam.name : homeTeamPlaceholder} */}
                        {homeTeam?.name || ""}
                      </span>
                      <span className="hidden max-sm:block font-bold">
                        {/* {homeTeam ? homeTeam.code : homeTeamPlaceholder} */}
                        {homeTeam?.code || ""}
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
                        {/* {awayTeam ? awayTeam.name : awayTeamPlaceholder} */}
                        {awayTeam?.name || ""}
                      </span>
                      <span className="hidden max-sm:block font-bold">
                        {/* {awayTeam ? awayTeam.code : awayTeamPlaceholder} */}
                        {awayTeam?.code || ""}
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
