import Image from "next/image";

import { Country, League, LeagueSeason, LeagueTeam } from "@prisma/client";

import PageHeader from "@/components/PageHeader";

import { Badge } from "@/components/ui/badge";

interface LeagueSeasonProps extends LeagueSeason {
  league: League;
  winner: LeagueTeam | null;
  titleHolder: LeagueTeam | null;
}

export default function LeaguesHistory({
  league,
  leagueSeasons,
}: {
  league: League;
  leagueSeasons: LeagueSeasonProps[];
}) {
  // function getScore(match: any) {
  //   const homeExtraGoals = match.homeExtraTimeGoals || 0;
  //   const awayExtraGoals = match.awayExtraTimeGoals || 0;
  //   const homePenalty = match.homePenaltyGoals || 0;
  //   const awayPenalty = match.awayPenaltyGoals || 0;

  //   const homeScore = match.homeGoals + homeExtraGoals + homePenalty;
  //   const awayScore = match.awayGoals + awayExtraGoals + awayPenalty;

  //   if (match.leagueSeason.winner.id === match.homeTeam.id) {
  //     if (match.homeGoals === match.awayGoals) {
  //       if (homeExtraGoals === awayExtraGoals) {
  //         return `${match.awayTeam.name} [ ${
  //           match.homeGoals + homeExtraGoals
  //         } - ${
  //           match.awayGoals + awayExtraGoals
  //         } ] (After Penalties: ${homePenalty} - ${awayPenalty})`;
  //       } else {
  //         return `${match.awayTeam.name} [ ${homeScore} - ${awayScore} ] (After Extra Time)`;
  //       }
  //     }

  //     return `${match.awayTeam.name} [ ${homeScore} - ${awayScore} ]`;
  //   } else {
  //     if (match.homeGoals === match.awayGoals) {
  //       if (homeExtraGoals === awayExtraGoals) {
  //         return `${match.homeTeam.name} [ ${
  //           match.awayGoals + awayExtraGoals
  //         } - ${
  //           match.homeGoals + homeExtraGoals
  //         } ] (After Penalties: ${awayPenalty} - ${homePenalty})`;
  //       } else {
  //         return `${match.homeTeam.name} [ ${awayScore} - ${homeScore} ] (After Extra Time)`;
  //       }
  //     }

  //     return `${match.homeTeam.name} [ ${awayScore} - ${homeScore} ]`;
  //   }
  // }

  return (
    <>
      <PageHeader label={`${league?.name} History`} />
      {leagueSeasons.map((season) => (
        <div
          key={season.id}
          className="flex items-end py-4 gap-4 border-b border-primary/10 last:border-0"
        >
          {season.logoUrl && (
            <Image
              width={125}
              height={125}
              src={season.logoUrl}
              alt={`${season?.league?.name} ${season?.year} Logo`}
              className="hidden sm:block"
            />
          )}
          <div className="flex flex-col gap-2 flex-1">
            <Badge variant="outline" className="text-[16px] sm:text-lg w-fit">
              {season.year}
            </Badge>
            <div className="grid grid-cols-[100px_1fr] grid-rows-2 gap-2 items-center">
              {/* <span className="col-start-1 row-start-1 text-sm sm:text-[16px]">
                  Hosted by
                </span>
                <div className="col-start-2 row-start-1 flex flex-wrap gap-2">
                  {season.leagueSeason.hostingCountries.map((country) => (
                    <div key={country.id} className="flex items-center gap-2">
                      <Badge
                        key={country.id}
                        variant="secondary"
                        className="flex gap-2 items-center text-[16px] sm:text-lg"
                      >
                        {country.flagUrl && (
                          <Image
                            width={30}
                            height={30}
                            src={country.flagUrl}
                            alt={country.name + " Flag"}
                            className="w-6 sm:w-8 h-6 sm:h-8"
                          />
                        )}
                        {country.name}
                      </Badge>
                    </div>
                  ))}
                </div> */}
              <span className="col-start-1 row-start-2 text-sm sm:text-[16px]">
                Winner
              </span>
              <div className="col-start-2 row-start-2 flex gap-2 items-center justify-start">
                {season.winner && (
                  <div className="flex flex-col xs:flex-row gap-2">
                    <Badge
                      variant="green"
                      className="flex gap-2 items-center text-[16px] sm:text-lg"
                    >
                      {season.winner.flagUrl && (
                        <Image
                          width={30}
                          height={30}
                          src={season.winner.flagUrl}
                          alt={season.winner.name + " Flag"}
                          className="w-6 sm:w-8 h-6 sm:h-8"
                        />
                      )}
                      {season.winner.name}
                    </Badge>
                    {/* <Badge
                        variant="outline"
                        className="border-0 text-[12px] sm:text-sm text-ring"
                      >
                        {getScore(season)}
                      </Badge> */}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
