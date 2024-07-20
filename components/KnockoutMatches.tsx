"use client";

import { useState } from "react";

import { KnockoutMatch } from "@prisma/client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import Image from "next/image";

import * as _ from "lodash";

import { Filter } from "lucide-react";

import { getFormattedDate, getFormattedTime } from "@/lib/getFormattedDate";

import NoDataFound from "./NoDataFound";

const KnockoutMatches = ({ matches }: { matches: KnockoutMatch[] }) => {
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
              className='flex gap-2'
            >
              <Filter />
              Click to Group by {groupBy === "round" ? "Date" : "Round"}
            </Button>
          </div>
          <div className='flex flex-col gap-8'>
            {results.map(([divider, list]) => {
              return (
                <div key={divider + new Date().toString()}>
                  <p className='mb-2 bg-sky-200 w-fit p-2 rounded-sm font-semibold'>
                    {groupBy === "date"
                      ? divider === "null"
                        ? "Matches Without Date"
                        : getFormattedDate(divider)
                      : divider}
                  </p>
                  <div className='flex flex-wrap items-center justify-start gap-2'>
                    {list.map((match: KnockoutMatch) => (
                      <Card key={match.id} className='w-full'>
                        <CardHeader>
                          <CardTitle className='flex flex-col items-center justify-center gap-4'>
                            <div className='mr-auto'>
                              {match.round && (
                                <Badge variant='secondary'>{match.round}</Badge>
                              )}
                            </div>
                            <div className='flex items-center justify-center gap-4'>
                              <p className='text-[18px] font-bold'>
                                {match.homeTeam
                                  ? match.homeTeam?.name
                                  : match.homeTeamPlacehlder}
                              </p>
                              {match.homeTeam && match.homeTeam.flagUrl && (
                                <Image
                                  src={match.homeTeam?.flagUrl}
                                  width={25}
                                  height={25}
                                  alt={`${match.homeTeam?.name} Flag`}
                                />
                              )}
                              {match.homeGoals !== null && (
                                <span className='text-[22px] font-bold ml-8'>
                                  {match.homeGoals}
                                </span>
                              )}{" "}
                              -{" "}
                              {match.awayGoals !== null && (
                                <span className='text-[22px] font-bold mr-8'>
                                  {match.awayGoals}
                                </span>
                              )}
                              {match.awayTeam && match.awayTeam.flagUrl && (
                                <Image
                                  src={match.awayTeam?.flagUrl}
                                  width={25}
                                  height={25}
                                  alt={`${match.awayTeam?.name} Flag`}
                                />
                              )}
                              <p className='text-[18px]  font-bold'>
                                {match.awayTeam
                                  ? match.awayTeam?.name
                                  : match.awayTeamPlacehlder}
                              </p>
                            </div>
                          </CardTitle>
                        </CardHeader>
                        {match.date && (
                          <CardContent className='flex justify-between'>
                            <Badge variant='default'>
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
        </>
      ) : (
        <NoDataFound message='Sorry, No Matches Found' />
      )}
    </>
  );
};

export default KnockoutMatches;
