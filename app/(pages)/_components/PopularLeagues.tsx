import prisma from "@/lib/db";

import Image from "next/image";
import Link from "next/link";

import PartsTitle from "@/app/(pages)/_components/PartsTitle";

import { LeagueStages } from "@/types/enums";
import { EmptyImageUrls } from "@/types/enums";

export default async function PopularLeagues() {
  const leagues = await prisma.season.findMany({
    where: {
      league: {
        isPopular: true,
      },
      currentStage: {
        not: LeagueStages.Finished,
      },
    },
    select: {
      league: {
        select: {
          name: true,
          flagUrl: true,
          continent: true,
          country: {
            select: {
              name: true,
            },
          },
        },
      },
      flagUrl: true,
      slug: true,
    },
  });

  if (leagues.length === 0) return <></>;

  return (
    <div className="space-y-2">
      <PartsTitle title="Popular Leagues" />
      <div className="bg-primary/10">
        <div className="flex flex-col items-start justify-center">
          {leagues.map(
            (
              {
                league: { continent, country, flagUrl: leagueFlagUrl, name },
                slug,
                flagUrl,
              },
              idx
            ) => (
              // <Link key={idx} href={`/${type}/${slug}/info`} className="w-full">
              <Link key={idx} href={`/leagues/${slug}/info`} className="w-full">
                <div className="w-full flex gap-4 items-center px-4 py-2 border-b border-primary/20 hover:bg-primary/20 transition duration-300">
                  <Image
                    width={25}
                    height={25}
                    src={flagUrl || leagueFlagUrl || EmptyImageUrls.League}
                    alt={name + " Logo"}
                  />
                  <div className="flex flex-col gap-1 items-start">
                    <p className="font-semibold text-sm">{name}</p>
                    {country && (
                      <p className="text-muted-foreground text-xs">
                        {country?.name}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  );
}
