import { FC } from "react";

import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Tournament } from "@/typings";
import Image from "next/image";

interface Props {
  tournaments: Tournament[];
}

const TournamentList: FC<Props> = async ({ tournaments }) => {
  return (
    <div className='flex gap-4 py-24'>
      {tournaments.length > 0 ? (
        tournaments.map(({ id, name, logoUrl }) => (
          <Link href={`/tournaments/${id}`} key={id}>
            <Card className='max-w-fit bg-secondary hover:shadow-md transition duration-200'>
              <CardHeader>
                <CardTitle className='mx-auto'>{name}</CardTitle>
              </CardHeader>
              <CardContent>
                <Image
                  src={`/tournaments/${logoUrl ? logoUrl : "tournament.png"}`}
                  width={logoUrl ? 250 : 150}
                  height={logoUrl ? 250 : 150}
                  alt={`${logoUrl ? name + " Logo" : "Tournament Image"}`}
                  className='mx-auto'
                />
              </CardContent>
            </Card>
          </Link>
        ))
      ) : (
        <p>No Tournaments Found</p>
      )}
    </div>
  );
};

export default TournamentList;
