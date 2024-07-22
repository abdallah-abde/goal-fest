import { FC } from "react";
import Image from "next/image";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import prisma from "@/lib/db";
import NoDataFound from "@/components/NoDataFound";

const HomePage: FC = async () => {
  const tournaments = await prisma.tournament.findMany();

  return (
    <div className='h-screen flex flex-col md:flex-row gap-4 py-24 overflow-auto'>
      {tournaments.length > 0 ? (
        tournaments.map(({ id, name, logoUrl }) => (
          <Link href={`/tournaments/${id}`} key={id}>
            <Card className='bg-secondary hover:shadow-md transition duration-200 p-2 pt-0'>
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
        ))
      ) : (
        <NoDataFound message='Sorry, No Tournaments Found' />
      )}
    </div>
  );
};

export default HomePage;
