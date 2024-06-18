import { FC } from "react";

import Link from "next/link";

import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { Tournament } from "@/typings";

const TournamentsList: FC<Tournament[]> = async ({ tournaments }) => {
  return (
    <div className='flex gap-4'>
      {tournaments.map(({ id, name }) => (
        <Card key={id} className='max-w-fit'>
          <CardHeader>
            <CardTitle>{name}</CardTitle>
          </CardHeader>
          <CardFooter className='flex items-center justify-between gap-2'>
            <Link
              href={`/tournaments/${id}`}
              className='p-2 rounded-md text-xs hover:bg-slate-400 transition-all duration-300'
            >
              GROUPS
            </Link>
            <Link
              href={`/tournaments/${id}/matches`}
              className='p-2 rounded-md text-xs hover:bg-green-200 transition-all duration-300'
            >
              MATCHES
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default TournamentsList;
