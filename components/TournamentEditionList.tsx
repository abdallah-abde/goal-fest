import { FC } from "react";

import Link from "next/link";

import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import { TournamentEdition } from "@/typings";
import Image from "next/image";

const TournamentEditionList: FC<TournamentEdition[]> = async ({
  tournamentEditions,
}) => {
  return (
    <div className='flex gap-4'>
      {tournamentEditions.length > 0 ? (
        tournamentEditions.map(({ id, year, logoUrl, tournament }) => (
          <Card key={id} className='max-w-fit'>
            <CardHeader>
              <CardTitle className='mx-auto'>
                {`${tournament.name} ${year.toString()}`}{" "}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Image
                src={`/tournaments/${logoUrl ? logoUrl : "tournament.png"}`}
                width={logoUrl ? 250 : 150}
                height={logoUrl ? 250 : 150}
                alt={`${
                  logoUrl
                    ? tournament.name + " " + year.toString() + " Logo"
                    : "Tournament Image"
                }`}
                className='mx-auto'
              />
            </CardContent>
            <CardFooter className='flex gap-4 justify-between'>
              <Link
                href={`/tournaments/${tournament.id}/editions/${id}`}
                className='p-2 rounded-md hover:bg-slate-200 transition-all duration-200'
              >
                Groups
              </Link>
              <Link
                href={`/tournaments/${tournament.id}/editions/${id}/matches`}
                className='p-2 rounded-md hover:bg-slate-200 transition-all duration-200'
              >
                Matches
              </Link>
            </CardFooter>
          </Card>
        ))
      ) : (
        <p>No Data Found</p>
      )}
    </div>
  );
};

export default TournamentEditionList;
