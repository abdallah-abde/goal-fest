import { FC } from "react";

import Link from "next/link";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { TournamentEdition } from "@/typings";
import Image from "next/image";

interface Props {
  tournamentEditions: TournamentEdition[];
}

const TournamentEditionList: FC<Props> = async ({ tournamentEditions }) => {
  return (
    <div>
      <div className='flex gap-4 py-24'>
        {tournamentEditions.length > 0 ? (
          tournamentEditions.map(({ id, year, logoUrl, tournament }) => (
            <Link href={`/tournaments/${tournament.id}/editions/${id}/`}>
              <Card
                key={id}
                className='max-w-fit bg-secondary hover:shadow-md transition duration-200'
              >
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
              </Card>
            </Link>
          ))
        ) : (
          <p>No Tournament Editions Found</p>
        )}
      </div>
    </div>
  );
};

export default TournamentEditionList;
