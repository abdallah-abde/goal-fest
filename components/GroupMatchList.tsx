import { FC } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Match } from "@/typings";
import Image from "next/image";
import { Badge } from "./ui/badge";

const GroupMatchList: FC<Match[]> = async ({ matches }) => {
  return (
    <div className='flex gap-4'>
      {matches.length > 0 ? (
        matches.map((match: Match) => (
          <Card key={match.id} className='max-w-fit'>
            <CardHeader>
              <CardTitle className='flex flex-col items-center justify-center gap-4'>
                <div className='mr-auto'>
                  <Badge variant='secondary'>{match.group.name}</Badge>
                </div>
                <div className='flex items-center justify-center gap-4'>
                  <p>{match.homeTeam.name}</p>
                  <Image
                    src={`/teams/${match.homeTeam.flagUrl}`}
                    width={25}
                    height={25}
                    alt={`${match.homeTeam.name} flag`}
                  />
                  {match.homeGoals && <span>{match.homeGoals}</span>} -
                  {match.awayGoals && <span>{match.awayGoals}</span>}
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
        ))
      ) : (
        <p>No Data Found</p>
      )}
    </div>
  );
};

export default GroupMatchList;
