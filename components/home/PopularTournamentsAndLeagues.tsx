import prisma from "@/lib/db";

import Image from "next/image";
import Link from "next/link";

import PartsTitle from "@/components/home/PartsTitle";

import { LeagueStages, TournamentStages } from "@/types/enums";
import { EmptyImageUrls } from "@/types/enums";

interface TournamentOrLeague {
  name: string;
  logoUrl: string;
  slug: string;
  currentTournamentOrLeagueLogoUrl: string;
  type: string;
  country: string;
}

export default async function PopulatTournamentsAndLeagues() {
  const [tournaments, leagues] = await Promise.all([
    prisma.tournamentEdition.findMany({
      where: {
        tournament: {
          isPopular: true,
        },
        currentStage: {
          not: TournamentStages.Finished,
        },
      },
      select: {
        tournament: {
          select: {
            name: true,
            logoUrl: true,
            type: true,
          },
        },
        logoUrl: true,
        slug: true,
      },
    }),
    prisma.leagueSeason.findMany({
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
            logoUrl: true,
            country: {
              select: {
                name: true,
              },
            },
          },
        },
        logoUrl: true,
        slug: true,
      },
    }),
  ]);

  const data: TournamentOrLeague[] = tournaments
    .map((tour) => {
      return {
        name: tour.tournament.name,
        logoUrl: tour.tournament.logoUrl,
        slug: tour.slug,
        currentTournamentOrLeagueLogoUrl: tour.logoUrl,
        type: "tournaments",
        country: tour.tournament.type,
      };
    })
    .concat(
      leagues.map((tour) => {
        return {
          name: tour.league.name,
          logoUrl: tour.league.logoUrl,
          slug: tour.slug,
          currentTournamentOrLeagueLogoUrl: tour.logoUrl,
          type: "leagues",
          country: tour.league.country?.name || tour.league.type || "",
        };
      })
    );

  if (data.length === 0) return <></>;

  return (
    <div className="space-y-2">
      <PartsTitle title="Popular Tournaments and Leagues" />
      <div className="bg-primary/10">
        <div className="flex flex-col items-start justify-center">
          {data.map(
            (
              {
                type,
                slug,
                currentTournamentOrLeagueLogoUrl,
                logoUrl,
                name,
                country,
              },
              idx
            ) => (
              <Link key={idx} href={`/${type}/${slug}/info`} className="w-full">
                <div className="w-full flex gap-4 items-center px-4 py-2 border-b border-primary/20 hover:bg-primary/20 transition duration-300">
                  <Image
                    width={25}
                    height={25}
                    src={
                      currentTournamentOrLeagueLogoUrl ||
                      logoUrl || EmptyImageUrls.Tournament
                    }
                    alt={name + " Logo"}
                  />
                  <div className="flex flex-col gap-1 items-start">
                    <p className="font-semibold text-sm">{name}</p>
                    {country && (
                      <p className="text-muted-foreground text-xs">{country}</p>
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
