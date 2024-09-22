"use client";

import Link from "next/link";
import Image from "next/image";

import { TournamentEdition, Tournament } from "@prisma/client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import NoDataFoundComponent from "@/components/NoDataFoundComponent";

interface TournamentEditionProps extends TournamentEdition {
  tournament: Tournament;
}

export default function EditionsCards({
  tournamentEditions,
}: {
  tournamentEditions: TournamentEditionProps[];
}) {
  return (
    <div className='h-screen flex flex-col md:flex-wrap md:flex-row gap-4 py-24'>
      {tournamentEditions.length > 0 ? (
        tournamentEditions.map(({ id, year, logoUrl, tournament }) => (
          <div key={id} className='md:overflow-auto last:pb-24'>
            <Link href={`/tournaments/${tournament.id}/editions/${id}/info`}>
              <Card className='bg-primary/5 text-secondary-foreground hover:shadow-lg transition duration-200 p-4 pt-0'>
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
          </div>
        ))
      ) : (
        <NoDataFoundComponent message='Sorry, No Tournament Editions Found' />
      )}
    </div>
  );
}
