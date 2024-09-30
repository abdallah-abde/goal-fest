import Image from "next/image";

import {
  Country,
  KnockoutMatch,
  Team,
  Tournament,
  TournamentEdition,
} from "@prisma/client";

import PageHeader from "@/components/PageHeader";

import { Badge } from "@/components/ui/badge";

interface TournamentEditionProps extends TournamentEdition {
  tournament: Tournament;
}

interface KnockoutMatchesProps extends KnockoutMatch {
  tournamentEdition: TournamentEditionProps & {
    winner: Team | null;
    hostingCountries: Country[];
  };
  homeTeam: Team | null;
  awayTeam: Team | null;
}

export default function History({
  tournamentEdition,
  matches,
}: {
  tournamentEdition: TournamentEditionProps;
  matches: KnockoutMatchesProps[];
}) {
  function getScore(match: any) {
    const homeExtraGoals = match.homeExtraTimeGoals || 0;
    const awayExtraGoals = match.awayExtraTimeGoals || 0;
    const homePenalty = match.homePenaltyGoals || 0;
    const awayPenalty = match.awayPenaltyGoals || 0;

    const homeScore = match.homeGoals + homeExtraGoals + homePenalty;
    const awayScore = match.awayGoals + awayExtraGoals + awayPenalty;

    if (match.tournamentEdition.winner.id === match.homeTeam.id) {
      if (match.homeGoals === match.awayGoals) {
        if (homeExtraGoals === awayExtraGoals) {
          return `${match.awayTeam.name} [ ${
            match.homeGoals + homeExtraGoals
          } - ${
            match.awayGoals + awayExtraGoals
          } ] (After Penalties: ${homePenalty} - ${awayPenalty})`;
        } else {
          return `${match.awayTeam.name} [ ${homeScore} - ${awayScore} ] (After Extra Time)`;
        }
      }

      return `${match.awayTeam.name} [ ${homeScore} - ${awayScore} ]`;
    } else {
      if (match.homeGoals === match.awayGoals) {
        if (homeExtraGoals === awayExtraGoals) {
          return `${match.homeTeam.name} [ ${
            match.awayGoals + awayExtraGoals
          } - ${
            match.homeGoals + homeExtraGoals
          } ] (After Penalties: ${awayPenalty} - ${homePenalty})`;
        } else {
          return `${match.homeTeam.name} [ ${awayScore} - ${homeScore} ] (After Extra Time)`;
        }
      }

      return `${match.homeTeam.name} [ ${awayScore} - ${homeScore} ]`;
    }
  }

  return (
    <>
      <PageHeader label={`${tournamentEdition.tournament.name} History`} />
      {matches.length > 0 &&
        matches.map((match) => (
          <div
            key={match.id}
            className='flex items-end py-4 gap-4 border-b border-primary/10 last:border-0'
          >
            {match.tournamentEdition.logoUrl && (
              <Image
                width={125}
                height={125}
                src={match.tournamentEdition.logoUrl}
                alt={`${match.tournamentEdition.tournament.name} ${match.tournamentEdition.year} Logo`}
                className='hidden sm:block'
              />
            )}
            <div className='flex flex-col gap-2 flex-1'>
              <Badge variant='outline' className='text-[16px] sm:text-lg w-fit'>
                {match.tournamentEdition.year}
              </Badge>
              <div className='grid grid-cols-[100px_1fr] grid-rows-2 gap-2 items-center'>
                <span className='col-start-1 row-start-1 text-sm sm:text-[16px]'>
                  Hosted by
                </span>
                <div className='col-start-2 row-start-1 flex flex-wrap gap-2'>
                  {match.tournamentEdition.hostingCountries.map((country) => (
                    <div key={country.id} className='flex items-center gap-2'>
                      <Badge
                        key={country.id}
                        variant='secondary'
                        className='flex gap-2 items-center text-[16px] sm:text-lg'
                      >
                        {country.flagUrl && (
                          <Image
                            width={30}
                            height={30}
                            src={country.flagUrl}
                            alt={country.name + " Flag"}
                            className='w-6 sm:w-8 h-6 sm:h-8'
                          />
                        )}
                        {country.name}
                      </Badge>
                    </div>
                  ))}
                </div>
                <span className='col-start-1 row-start-2 text-sm sm:text-[16px]'>
                  Winner
                </span>
                <div className='col-start-2 row-start-2 flex gap-2 items-center justify-start'>
                  {match.tournamentEdition.winner && (
                    <div className='flex flex-col xs:flex-row gap-2'>
                      <Badge
                        variant='green'
                        className='flex gap-2 items-center text-[16px] sm:text-lg'
                      >
                        {match.tournamentEdition.winner.flagUrl && (
                          <Image
                            width={30}
                            height={30}
                            src={match.tournamentEdition.winner.flagUrl}
                            alt={match.tournamentEdition.winner.name + " Flag"}
                            className='w-6 sm:w-8 h-6 sm:h-8'
                          />
                        )}
                        {match.tournamentEdition.winner.name}
                      </Badge>
                      <Badge
                        variant='outline'
                        className='border-0 text-[12px] sm:text-sm text-ring'
                      >
                        {getScore(match)}
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
