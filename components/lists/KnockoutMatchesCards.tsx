"use client";

import { useState } from "react";

import { KnockoutMatch, Team, TournamentEdition } from "@prisma/client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import Image from "next/image";

import * as _ from "lodash";

import { Filter } from "lucide-react";

import { getFormattedDate, getFormattedTime } from "@/lib/getFormattedDate";

import NoDataFoundComponent from "@/components/NoDataFoundComponent";

interface KnockoutMatchProps extends KnockoutMatch {
  homeTeam: Team | null;
  awayTeam: Team | null;
  tournamentEdition: TournamentEdition;
}

const KnockoutMatchesCards = ({
  matches,
}: {
  matches: KnockoutMatchProps[];
}) => {
  const [groupBy, setGroupBy] = useState("date");
  const results = Object.entries(_.groupBy(matches, groupBy));

  return (
    <>
      {results.length > 0 ? (
        <>
          <div className='flex justify-end pb-2'>
            <Button
              variant='outline'
              onClick={() => {
                setGroupBy(groupBy === "round" ? "date" : "round");
              }}
              className='flex gap-2 border-2 border-secondary hover:border-primary/10'
            >
              <Filter />
              Group by {groupBy === "round" ? "Date" : "Round"}
            </Button>
          </div>
          <div className='flex flex-col gap-8'>
            {results.map(([divider, list], _) => {
              return (
                // <div key={divider + new Date().toString()}>
                <div key={_}>
                  <p className='text-[14px] sm:text-[16px] mb-2 border-2 border-primary/10 w-fit p-2 rounded-sm font-semibold'>
                    {groupBy === "date"
                      ? divider === "null"
                        ? "Matches without date"
                        : getFormattedDate(divider)
                      : divider === "null"
                      ? "Matches without round"
                      : divider}
                  </p>
                  <div className='flex flex-wrap items-center justify-start gap-2'>
                    {list.map((match) => (
                      <Card key={match.id} className='w-full bg-primary/10'>
                        <CardHeader>
                          <CardTitle className='flex flex-col items-center justify-center gap-4'>
                            <div className='mr-auto'>
                              <Badge
                                variant={
                                  match.round ? "secondary" : "destructive"
                                }
                                className='hover:bg-secondary'
                              >
                                {match.round || "No round info"}
                              </Badge>
                            </div>
                            <div className='flex items-center justify-center gap-4'>
                              <div className='flex flex-col md:flex-row gap-2 items-center'>
                                <p className='hidden xs:block text-[16px] xs:text-[18px] font-bold'>
                                  {match.homeTeam
                                    ? match.homeTeam?.name
                                    : match.homeTeamPlacehlder}
                                </p>
                                <p className='hidden max-xs:block text-[16px] font-bold'>
                                  {!match.homeTeam
                                    ? match.homeTeamPlacehlder
                                    : match.homeTeam.code
                                    ? match.homeTeam.code
                                    : match.homeTeam.name}
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
                                <span className='text-[18px] xs:text-[22px] font-bold ml-8'>
                                  {match.homeGoals}
                                </span>
                              )}{" "}
                              -{" "}
                              {match.awayGoals !== null && (
                                <span className='text-[18px] xs:text-[22px] font-bold mr-8'>
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
                                <p className='hidden xs:block text-[16px] xs:text-[18px] font-bold'>
                                  {match.awayTeam
                                    ? match.awayTeam?.name
                                    : match.awayTeamPlacehlder}
                                </p>
                                <p className='hidden max-xs:block text-[16px] font-bold'>
                                  {!match.awayTeam
                                    ? match.awayTeamPlacehlder
                                    : match.awayTeam.code
                                    ? match.awayTeam.code
                                    : match.awayTeam.name}
                                </p>
                              </div>
                            </div>
                          </CardTitle>
                        </CardHeader>
                        {/* {match.date && ( */}
                        <CardContent className='flex justify-between'>
                          <Badge
                            variant={match.date ? "default" : "destructive"}
                            className='hover:bg-primary'
                          >
                            {match.date
                              ? getFormattedDate(match.date.toString())
                              : "No date info"}
                          </Badge>
                          <Badge
                            variant={match.date ? "default" : "destructive"}
                          >
                            {match.date
                              ? getFormattedTime(match.date.toString())
                              : "No time info"}
                          </Badge>
                        </CardContent>
                        {/* )} */}
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <NoDataFoundComponent message='Sorry, No Matches Found' />
      )}
    </>
  );
};

export default KnockoutMatchesCards;
