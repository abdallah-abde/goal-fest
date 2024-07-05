import { FC } from "react";
import Image from "next/image";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import prisma from "@/lib/db";

const HomePage: FC = async () => {
  const tournaments = await prisma.tournament.findMany();

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
                  src={`${logoUrl ? logoUrl : "/tournaments/tournament.png"}`}
                  width={logoUrl ? 250 : 150}
                  height={logoUrl ? 250 : 150}
                  alt={`${logoUrl ? name + " Logo" : "Tournament Image"}`}
                  className='mx-auto object-contain'
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

export default HomePage;
