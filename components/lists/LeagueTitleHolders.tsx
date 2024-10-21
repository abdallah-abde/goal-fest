import Image from "next/image";

import { League, LeagueSeason } from "@prisma/client";

import * as _ from "lodash";

import PageHeader from "@/components/PageHeader";

import { Badge } from "@/components/ui/badge";

interface LeagueSeasonProps extends LeagueSeason {
  league: League;
}

interface WinnerProps {
  winnerId: number;
  teamName: string;
  flagUrl: string;
  year: number;
}

export default function TitleHolders({
  leagueSeason,
  leagueWinners,
}: {
  leagueSeason: LeagueSeasonProps;
  leagueWinners: WinnerProps[];
}) {
  const results = Object.entries(_.groupBy(leagueWinners, "teamName")).sort(
    (a, b) => {
      if (a[1].length > b[1].length) {
        return -1;
      } else {
        return 1;
      }
    }
  );

  return (
    <>
      <PageHeader label={`${leagueSeason.league.name} Title Holders`} />
      {results &&
        results.length > 0 &&
        results.map(([teamName, data]) => (
          <div
            key={teamName}
            className="grid grid-cols-4 py-4 border-b border-primary/10 last:border-0 place-items-center place-content-center min-h-[80px]"
          >
            {data[0].flagUrl && (
              <Image
                width={40}
                height={40}
                src={data[0].flagUrl}
                alt={teamName + " Flag"}
                className="col-start-1 max-xs:w-8 max-xs:h-8"
              />
            )}
            <Badge
              variant="outline"
              className="col-start-2 text-[14px] xs:text-lg w-fit self-center border-0"
            >
              {teamName}
            </Badge>
            <Badge
              variant="gold"
              className="col-start-3 text-[14px] xs:text-lg w-fit self-center"
            >
              {data.length}
            </Badge>
            <div className="col-start-4 flex flex-wrap gap-1">
              {data.map(({ winnerId, year }) => (
                <Badge
                  key={winnerId}
                  variant="green"
                  className="text-[11px] xs:text-sm mx-auto"
                >
                  {year}
                </Badge>
              ))}
            </div>
          </div>
        ))}
    </>
  );
}