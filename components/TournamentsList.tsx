import { FC } from "react";
import prisma from "@/lib/db";

import Image from "next/image";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const TournamentsList: FC = async () => {
  const tournaments = await prisma.tournament.findMany();

  return (
    <div className='flex gap-4'>
      {tournaments.map(({ id, name }) => (
        <Link key={`${id}${name}`} href={`/tournaments/${id}`}>
          <Card className='max-w-fit'>
            <CardHeader>
              <CardTitle>{name}</CardTitle>
            </CardHeader>
            {/* <CardContent className='flex items-center justify-center'>
              <Image
                width={200}
                height={200}
                alt={name}
                src={`/tournaments/${slug}.png`}
              />
            </CardContent> */}
            {/* <CardFooter className='flex justify-end'>
              {hostingCountry.map(({ id, name }) => (
                <Badge key={id} variant={"secondary"} className='text-[10px]'>
                  {name}
                </Badge>
              ))}
            </CardFooter> */}
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default TournamentsList;
