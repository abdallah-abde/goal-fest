"use client";

import Link from "next/link";
import Image from "next/image";

import { Tournament } from "@prisma/client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import NoDataFoundComponent from "@/components/NoDataFoundComponent";

export default function TournamentsCards({
  tournaments,
}: {
  tournaments: Tournament[];
}) {
  return (
    <div className='h-screen flex flex-col md:flex-wrap md:flex-row gap-4 py-24'>
      {tournaments.length > 0 ? (
        tournaments.map(({ id, name, logoUrl }) => (
          <div key={id} className='md:overflow-auto last:pb-24'>
            <Link href={`/tournaments/${id}`}>
              <Card className='bg-primary/5 text-secondary-foreground hover:shadow-lg transition duration-200 p-4 pt-0'>
                <CardHeader>
                  <CardTitle className='mx-auto text-xl'>{name}</CardTitle>
                </CardHeader>
                {logoUrl && (
                  <CardContent className='mx-auto h-[150px] w-[150px] relative'>
                    <Image
                      src={logoUrl}
                      fill
                      alt={`${name} Logo`}
                      className='mx-auto object-contain'
                    />
                  </CardContent>
                )}
              </Card>
            </Link>
          </div>
        ))
      ) : (
        <NoDataFoundComponent message='Sorry, No Tournaments Found' />
      )}
    </div>
  );
}
