import prisma from "@/lib/db";

import Image from "next/image";

import { Country, Team, Tournament, TournamentEdition } from "@prisma/client";

import PageHeader from "@/components/PageHeader";

import { Badge } from "@/components/ui/badge";

interface TournamentEditionProps extends TournamentEdition {
  tournament: Tournament;
  winner: Team | null;
  titleHolder: Team | null;
  hostingCountries: Country[];
}

export default async function TournamentsHistory({
  tournament,
  editions,
}: {
  tournament: Tournament;
  editions: TournamentEditionProps[];
}) {
  async function getScore(edition: TournamentEditionProps) {
    const finalMatch = await prisma.knockoutMatch.findFirst({
      where: {
        tournamentEdition: {
          slug: edition.slug,
        },
        round: "Final",
      },
      include: {
        tournamentEdition: {
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

    if (finalMatch.tournamentEdition?.winner?.id === finalMatch.homeTeam?.id) {
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
      <PageHeader label={`${tournament?.name} History`} />
      {editions.map((edition) => (
        <div
          key={edition.id}
          className="flex items-end py-4 gap-4 border-b border-primary/10 last:border-0"
        >
          {edition.logoUrl && (
            <Image
              width={125}
              height={125}
              src={edition.logoUrl}
              alt={`${edition?.tournament?.name} ${edition?.year} Logo`}
              className="hidden sm:block"
            />
          )}
          <div className="flex flex-col gap-2 flex-1">
            <Badge variant="outline" className="text-[16px] sm:text-lg w-fit">
              {edition?.year}
            </Badge>
            <div className="grid grid-cols-[100px_1fr] grid-rows-2 gap-2 items-center">
              <span className="col-start-1 row-start-1 text-sm sm:text-[16px]">
                Hosted by
              </span>
              <div className="col-start-2 row-start-1 flex flex-wrap gap-2">
                {edition.hostingCountries.map((country) => (
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
              </div>
              <span className="col-start-1 row-start-2 text-sm sm:text-[16px]">
                Winner
              </span>
              <div className="col-start-2 row-start-2 flex gap-2 items-center justify-start">
                {edition.winner && (
                  <div className="flex flex-col xs:flex-row gap-2">
                    <Badge
                      variant="green"
                      className="flex gap-2 items-center text-[16px] sm:text-lg"
                    >
                      {edition.winner.flagUrl && (
                        <Image
                          width={30}
                          height={30}
                          src={edition.winner.flagUrl}
                          alt={edition.winner.name + " Flag"}
                          className="w-6 sm:w-8 h-6 sm:h-8"
                        />
                      )}
                      {edition.winner.name}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-0 text-[12px] sm:text-sm text-ring"
                    >
                      {getScore(edition)}
                    </Badge>
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
