import { FC } from "react";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";

import { Match } from "@/typings";

const GroupMatchList: FC<Match[]> = async ({ matches }) => {
  return (
    <div className='flex gap-4'>
      {matches.length > 0 ? (
        matches.map(({ id, homeTeam, awayTeam }) => (
          <Card key={id} className='max-w-fit'>
            <CardHeader>
              <CardTitle>
                {homeTeam.name} - {awayTeam.name}
              </CardTitle>
            </CardHeader>
          </Card>
        ))
      ) : (
        <p>No Data Found</p>
      )}
    </div>
  );
};

export default GroupMatchList;
