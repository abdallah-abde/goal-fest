import { FC } from "react";

import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Tournament } from "@/typings";
import Image from "next/image";

const TournamentList: FC<Tournament[]> = async ({ tournaments }) => {
  return (
    <div className='flex gap-4'>
      {tournaments.length > 0 ? (
        tournaments.map(({ id, name, logoUrl }) => (
          <Link href={`/tournaments/${id}`}>
            <Card key={id} className='max-w-fit'>
              <CardHeader>
                <CardTitle className='mx-auto'>{name}</CardTitle>
              </CardHeader>
              <CardContent>
                <Image
                  src={`/tournaments/${logoUrl ? logoUrl : "tournament.png"}`}
                  width='150'
                  height='150'
                  alt={`${logoUrl ? name + " Logo" : "Tournament Image"}`}
                  className='mx-auto'
                />
              </CardContent>
            </Card>
          </Link>
        ))
      ) : (
        <p>No Data Found</p>
      )}
    </div>
  );
};

export default TournamentList;
