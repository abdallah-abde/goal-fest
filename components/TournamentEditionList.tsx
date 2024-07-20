import { FC } from "react";

import Link from "next/link";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { TournamentEdition } from "@/typings";
import Image from "next/image";
import NoDataFound from "./NoDataFound";

interface Props {
  tournamentEditions: TournamentEdition[];
}

const TournamentEditionList: FC<Props> = async ({ tournamentEditions }) => {
  return (
    <div className='flex gap-4 py-24'>
      {tournamentEditions.length > 0 ? (
        tournamentEditions.map(({ id, year, logoUrl, tournament }) => (
          <Link key={id} href={`/tournaments/${tournament.id}/editions/${id}/`}>
            <Card className='bg-secondary hover:shadow-md transition duration-200 p-2 pt-0'>
              <CardHeader>
                <CardTitle className='mx-auto text-xl'>
                  {`${tournament.name} ${year.toString()}`}{" "}
                </CardTitle>
              </CardHeader>
              {logoUrl && (
                <CardContent className='mx-auto h-[150px] w-[150px] relative'>
                  <Image
                    src={logoUrl}
                    fill
                    alt={`${tournament.name} ${year.toString()} Logo`}
                    className='mx-auto object-contain '
                  />
                </CardContent>
              )}
            </Card>
          </Link>
        ))
      ) : (
        <NoDataFound message='Sorry, No Tournament Editions Found' />
      )}
    </div>
  );
};

export default TournamentEditionList;
