import { FC } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Match } from "@/typings";
import Image from "next/image";
import { Badge } from "./ui/badge";

import * as _ from "lodash";

const GroupMatchList: FC<Match[]> = async ({ matches }) => {
  const results = Object.entries(_.groupBy(matches, "date"));

  return (
    <div className='flex flex-col gap-8'>
      {results.length > 0 ? (
        <>
          {results.map((m) => {
            return (
              <div>
                <p className='mb-2 bg-sky-200 w-fit p-2 rounded-sm font-semibold'>
                  {new Date(m[0]).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <div className='flex gap-2'>
                  {m[1].map((match: Match) => (
                    <Card key={match.id} className='w-1/3'>
                      <CardHeader>
                        <CardTitle className='flex flex-col items-center justify-center gap-4'>
                          <div className='mr-auto'>
                            <Badge variant='secondary'>
                              {match.group.name}
                            </Badge>
                          </div>
                          <div className='flex items-center justify-center gap-4'>
                            <p>{match.homeTeam.name}</p>
                            <Image
                              src={`/teams/${match.homeTeam.flagUrl}`}
                              width={25}
                              height={25}
                              alt={`${match.homeTeam.name} flag`}
                            />
                            {match.homeGoals !== null && (
                              <span>{match.homeGoals}</span>
                            )}{" "}
                            -{" "}
                            {match.awayGoals !== null && (
                              <span>{match.awayGoals}</span>
                            )}
                            <Image
                              src={`/teams/${match.awayTeam.flagUrl}`}
                              width={25}
                              height={25}
                              alt={`${match.awayTeam.name} flag`}
                            />
                            <p>{match.awayTeam.name}</p>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      {match.date && (
                        <CardContent className='text-right'>
                          <Badge variant='default'>
                            {match.date.toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
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
        <p>No Data Found</p>
      )}
    </div>
  );
};

export default GroupMatchList;
