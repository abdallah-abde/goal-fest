import prisma from "@/lib/db";

import Image from "next/image";
import Link from "next/link";

import PartsTitle from "@/app/(pages)/_components/PartsTitle";
import { EmptyImageUrls } from "@/types/enums";

export default async function PopularTeams() {
  const teams = await prisma.team.findMany({
    where: {
      isPopular: true,
      isClub: true,
    },
    select: {
      name: true,
      flagUrl: true,
      country: {
        select: {
          name: true,
        },
      },
    },
  });

  if (teams.length === 0) return <></>;

  return (
    <div className="space-y-2">
      <PartsTitle title="Popular Teams" />
      <div className="bg-primary/10">
        <div className="flex flex-col items-start justify-center">
          {teams.map(({ name, flagUrl, country }, idx) => (
            <Link key={idx} href="#" className="w-full">
              <div className="w-full flex gap-4 items-center px-4 py-2 border-b border-primary/20 hover:bg-primary/20 transition duration-300">
                <Image
                  width={25}
                  height={25}
                  src={flagUrl || EmptyImageUrls.Team}
                  alt={name + " Flag"}
                />
                <div className="flex flex-col gap-1 items-start">
                  <p className="font-semibold text-sm">{name}</p>
                  {country && (
                    <p className="text-muted-foreground text-xs">
                      ({country.name})
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
