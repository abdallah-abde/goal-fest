import Image from "next/image";
import { Match, Group, Team } from "@prisma/client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import * as _ from "lodash";

import { getFormattedDate, getFormattedTime } from "@/lib/getFormattedDate";

import NoDataFoundComponent from "@/components/NoDataFoundComponent";

interface MatchProps extends Match {
  group: Group;
  homeTeam: Team;
  awayTeam: Team;
}

export default async function GroupMatchesCards({
  matches,
}: {
  matches: MatchProps[];
}) {
  const results = Object.entries(
    _.groupBy(matches, (item) =>
      getFormattedDate(item.date ? item.date?.toDateString() : "")
    )
  );

  return (
    <>
      {results.length > 0 ? (
        <div className='flex flex-col gap-8'>
          {results.map(([divider, list]) => {
            return (
              <div key={divider}>
                <p className='text-[14px] sm:text-[16px] mb-2 border-2 border-primary/10 w-fit p-2 rounded-sm font-semibold'>
                  {getFormattedDate(divider)}
                </p>
                <div className='flex flex-wrap items-center justify-start gap-2'>
                  {list.map((match) => (
                    <Card key={match.id} className='w-full bg-primary/10'>
                      <CardHeader>
                        <CardTitle className='flex flex-col items-center justify-center gap-4'>
                          <div className='flex w-full justify-between'>
                            <div>
                              <Badge
                                variant='secondary'
                                className='hover:bg-secondary'
                              >
                                {match.group.name}
                              </Badge>
                            </div>
                            {match.round && (
                              <div>
                                <Badge variant='outline'>{`Round ${match.round}`}</Badge>
                              </div>
                            )}
                          </div>
                          <div className='flex items-center justify-between gap-4'>
                            <div className='flex flex-col md:flex-row gap-2 items-center'>
                              <p className='text-[14px] sm:text-[18px] font-bold'>
                                {match.homeTeam.name}
                              </p>
                              {match.homeTeam && match.homeTeam.flagUrl && (
                                <Image
                                  src={match.homeTeam?.flagUrl}
                                  width={25}
                                  height={25}
                                  alt={`${match.homeTeam?.name} Flag`}
                                />
                              )}
                            </div>
                            {match.homeGoals !== null && (
                              <span className='text-[16px] sm:text-[22px] font-bold ml-8'>
                                {match.homeGoals}
                              </span>
                            )}{" "}
                            -{" "}
                            {match.awayGoals !== null && (
                              <span className='text-[16px] sm:text-[22px] font-bold mr-8'>
                                {match.awayGoals}
                              </span>
                            )}
                            <div className='flex flex-col-reverse md:flex-row gap-2 items-center'>
                              {match.awayTeam && match.awayTeam.flagUrl && (
                                <Image
                                  src={match.awayTeam?.flagUrl}
                                  width={25}
                                  height={25}
                                  alt={`${match.awayTeam?.name} Flag`}
                                />
                              )}
                              <p className='text-[14px] sm:text-[18px] font-bold'>
                                {match.awayTeam.name}
                              </p>
                            </div>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      {match.date && (
                        <CardContent className='flex justify-between'>
                          <Badge variant='default' className='hover:bg-primary'>
                            {match.date
                              ? getFormattedDate(match.date.toString())
                              : ""}
                          </Badge>
                          <Badge variant='outline'>
                            {match.date
                              ? getFormattedTime(match.date.toString())
                              : ""}
                          </Badge>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <NoDataFoundComponent message='Sorry, No Matches Found' />
      )}
    </>
  );
}
