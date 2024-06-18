import { FC } from "react";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";

import { Match } from "@/typings";

const MatchList: FC<Match[]> = async ({ matches }) => {
  return (
    <div className='flex gap-4'>
      {matches.map(({ id, name, homeTeam, awayTeam }) => (
        <Card key={id} className='max-w-fit'>
          <CardHeader>
            <CardTitle>
              {homeTeam.name} - {awayTeam.name}
            </CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};

export default MatchList;
