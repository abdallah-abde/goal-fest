"use client";

import { KnockoutMatch } from "@/typings";
import { FC, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter } from "lucide-react";

import { Badge } from "./ui/badge";
import Image from "next/image";
import * as _ from "lodash";
import { getFormattedDate } from "@/lib/getFormattedDate";
import { Button } from "./ui/button";

interface Props {
  matches: KnockoutMatch[];
}

const KnockoutMatches: FC<Props> = ({ matches }) => {
  const [groupBy, setGroupBy] = useState("date");
  const results = Object.entries(_.groupBy(matches, groupBy));

  return (
    <div className='mb-24'>
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
        {results.length > 0 ? (
          <>
            {results.map((m) => {
              return (
                <div key={m[0] + new Date().toString()}>
                  <p className='mb-2 bg-sky-200 w-fit p-2 rounded-sm font-semibold'>
                    {groupBy === "date"
                      ? m[0] === "null"
                        ? "Matches Without Date"
                        : getFormattedDate(m[0])
                      : m[0]}
                  </p>
                  <div className='flex flex-wrap items-center justify-start gap-2'>
                    {m[1].map((match: KnockoutMatch) => (
                      <Card key={match.id} className='w-1/3 max-w-96'>
                        <CardHeader>
                          <CardTitle className='flex flex-col items-center justify-center gap-4'>
                            <div className='mr-auto'>
                              {match.round && (
                                <Badge variant='secondary'>{match.round}</Badge>
                              )}
                            </div>
                            <div className='flex items-center justify-center gap-4'>
                              <p className='text-[16px] font-bold'>
                                {match.homeTeam
                                  ? match.homeTeam?.name
                                  : match.homeTeamPlacehlder}
                              </p>
                              {match.homeTeam && (
                                <Image
                                  src={`/teams/${match.homeTeam?.flagUrl}`}
                                  width={25}
                                  height={25}
                                  alt={`${match.homeTeam?.name} flag`}
                                />
                              )}
                              {match.homeGoals !== null && (
                                <span>{match.homeGoals}</span>
                              )}{" "}
                              -{" "}
                              {match.awayGoals !== null && (
                                <span>{match.awayGoals}</span>
                              )}
                              {match.awayTeam && (
                                <Image
                                  src={`/teams/${match.awayTeam?.flagUrl}`}
                                  width={25}
                                  height={25}
                                  alt={`${match.awayTeam?.name} flag`}
                                />
                              )}
                              <p className='text-[16px]  font-bold'>
                                {match.awayTeam
                                  ? match.awayTeam?.name
                                  : match.awayTeamPlacehlder}
                              </p>
                            </div>
                          </CardTitle>
                        </CardHeader>
                        {match.date && (
                          <CardContent className='text-right'>
                            <Badge variant='default'>
                              {match.date
                                ? getFormattedDate(match.date.toString())
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
          </>
        ) : (
          <p>No Matches Found</p>
        )}
      </div>
    </div>
  );
};

export default KnockoutMatches;
