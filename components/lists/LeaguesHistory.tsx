import prisma from "@/lib/db";

import Image from "next/image";

import { Country, League, Season, Team } from "@prisma/client";

import PageHeader from "@/components/PageHeader";

import { Badge } from "@/components/ui/badge";
import { EmptyImageUrls } from "@/types/enums";

interface SeasonProps extends Season {
  league: LeagueProps;
  winner: Team | null;
  titleHolder: Team | null;
  hostingCountries: Country[];
}

interface LeagueProps extends League {
  country: Country | null;
}

export default async function LeaguesHistory({
  league,
  seasons,
}: {
  league: League;
  seasons: SeasonProps[];
}) {
  async function getScore(season: SeasonProps) {
    const finalMatch = await prisma.match.findFirst({
      where: {
        season: {
          slug: season.slug,
        },
        round: "Final",
      },
      include: {
        season: {
          include: { winner: true },
        },
        homeTeam: true,
        awayTeam: true,
      },
    });

    if (!finalMatch) return;

    const homeGoals = finalMatch.homeGoals || 0;
    const awayGoals = finalMatch.awayGoals || 0;
    const homeExtraGoals = finalMatch.homeExtraTimeGoals || 0;
    const awayExtraGoals = finalMatch.awayExtraTimeGoals || 0;
    const homePenalty = finalMatch.homePenaltyGoals || 0;
    const awayPenalty = finalMatch.awayPenaltyGoals || 0;

    const homeScore = homeGoals + homeExtraGoals + homePenalty;
    const awayScore = awayGoals + awayExtraGoals + awayPenalty;

    if (finalMatch.season?.winner?.id === finalMatch.homeTeam?.id) {
      if (finalMatch.homeGoals === finalMatch.awayGoals) {
        if (homeExtraGoals === awayExtraGoals) {
          return `${finalMatch.awayTeam?.name} [ ${
            homeGoals + homeExtraGoals
          } - ${
            awayGoals + awayExtraGoals
          } ] (After Penalties: ${homePenalty} - ${awayPenalty})`;
        } else {
          return `${finalMatch.awayTeam?.name} [ ${homeScore} - ${awayScore} ] (After Extra Time)`;
        }
      }

      return `${finalMatch.awayTeam?.name} [ ${homeScore} - ${awayScore} ]`;
    } else {
      if (finalMatch.homeGoals === finalMatch.awayGoals) {
        if (homeExtraGoals === awayExtraGoals) {
          return `${finalMatch.homeTeam?.name} [ ${
            awayGoals + awayExtraGoals
          } - ${
            homeGoals + homeExtraGoals
          } ] (After Penalties: ${awayPenalty} - ${homePenalty})`;
        } else {
          return `${finalMatch.homeTeam?.name} [ ${awayScore} - ${homeScore} ] (After Extra Time)`;
        }
      }

      return `${finalMatch.homeTeam?.name} [ ${awayScore} - ${homeScore} ]`;
    }
  }

  return (
    <>
      <PageHeader label={`${league.name} History`} />
      {seasons.map((season) => {
        const {
          id,
          year,
          flagUrl,
          winner,
          hostingCountries,
          league: { isDomestic },
        } = season;

        return (
          <div
            key={id}
            className="flex items-end py-4 gap-4 border-b border-primary/10 last:border-0"
          >
            <Image
              width={125}
              height={125}
              src={flagUrl || EmptyImageUrls.League}
              alt={`${league.name} ${year} Flag`}
              className="aspect-video object-contain"
            />
            <div className="flex flex-col gap-2 flex-1">
              <Badge variant="outline" className="text-[16px] sm:text-lg w-fit">
                {year}
              </Badge>
              <div className="grid grid-cols-[100px_1fr] grid-rows-2 gap-2 items-center">
                {hostingCountries && (
                  <>
                    <span className="col-start-1 row-start-1 text-sm sm:text-[16px]">
                      Hosted by
                    </span>
                    <div className="col-start-2 row-start-1 flex flex-wrap gap-2">
                      {hostingCountries.map(({ id, flagUrl, name }) => (
                        <div key={id} className="flex items-center gap-2">
                          <Badge
                            key={id}
                            variant="secondary"
                            className="flex gap-2 items-center text-[16px] sm:text-lg"
                          >
                            <Image
                              width={30}
                              height={30}
                              src={flagUrl || EmptyImageUrls.Country}
                              alt={name + " Flag"}
                              className="aspect-video object-contain"
                            />
                            {name}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <span className="col-start-1 row-start-2 text-sm sm:text-[16px]">
                  Winner
                </span>
                <div className="col-start-2 row-start-2 flex gap-2 items-center justify-start">
                  {winner && (
                    <div className="flex flex-col xs:flex-row gap-2">
                      <Badge
                        variant="green"
                        className="flex gap-2 items-center text-[16px] sm:text-lg"
                      >
                        <Image
                          width={30}
                          height={30}
                          src={winner.flagUrl || EmptyImageUrls.Team}
                          alt={winner.name + " Flag"}
                          className="aspect-video object-contain"
                        />
                        {winner.name}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-0 text-[12px] sm:text-sm text-ring"
                      >
                        {!isDomestic && getScore(season)}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
