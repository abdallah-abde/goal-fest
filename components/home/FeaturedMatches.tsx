import prisma from "@/lib/db";

import Image from "next/image";

import {
  LeagueSeasonProps,
  NeutralMatch,
  TournamentEditionProps,
} from "@/types";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import {
  switchTournamentMatchesToNeutralMatches,
  switchTournamentKnockoutMatchesToNeutralMatches,
  switchLeagueMatchesToNeutralMatches,
  switchLeagueKnockoutMatchesToNeutralMatches,
} from "@/lib/data/switchers";
import { getFormattedDate, getFormattedTime } from "@/lib/getFormattedDate";
import { EmptyImageUrls } from "@/types/enums";

export default async function FeaturedMatches() {
  const [matches, knockoutMatches, leagueMatches, leagueKnockoutMatches] =
    await Promise.all([
      prisma.match.findMany({
        where: {
          isFeatured: true,
        },
        include: {
          tournamentEdition: {
            include: {
              tournament: true,
              hostingCountries: true,
              winner: true,
              teams: true,
              titleHolder: true,
              groups: true,
            },
          },
          homeTeam: true,
          awayTeam: true,
          group: true,
        },
      }),
      prisma.knockoutMatch.findMany({
        where: {
          isFeatured: true,
        },
        include: {
          tournamentEdition: {
            include: {
              tournament: true,
              hostingCountries: true,
              groups: true,
              teams: true,
              titleHolder: true,
              winner: true,
            },
          },
          homeTeam: true,
          awayTeam: true,
        },
      }),
      prisma.leagueMatch.findMany({
        where: {
          isFeatured: true,
        },
        include: {
          homeTeam: true,
          awayTeam: true,
          group: true,
          season: {
            include: {
              league: { include: { country: true } },
              groups: true,
              teams: true,
              titleHolder: true,
              winner: true,
            },
          },
        },
      }),
      prisma.leagueKnockoutMatch.findMany({
        where: {
          isFeatured: true,
        },
        include: {
          homeTeam: true,
          awayTeam: true,
          season: {
            include: {
              league: { include: { country: true } },
              groups: true,
              teams: true,
              titleHolder: true,
              winner: true,
            },
          },
        },
      }),
    ]);

  const allMatches: NeutralMatch[] = switchTournamentMatchesToNeutralMatches(
    matches
  ).concat(
    switchTournamentKnockoutMatchesToNeutralMatches(knockoutMatches),
    switchLeagueMatchesToNeutralMatches(leagueMatches),
    switchLeagueKnockoutMatchesToNeutralMatches(leagueKnockoutMatches)
  );

  if (allMatches.length === 0) return <></>;

  return (
    <div>
      {/* Today Important Matches slider */}
      <Carousel className="w-full">
        <CarouselContent>
          {allMatches.map((match, idx) => (
            <CarouselItem key={idx}>
              <div className="bg-primary/10 py-4 px-10 space-y-4">
              <div className='flex gap-2 items-center justify-center'>
              <Image
                    width={25}
                    height={25}
                    src={
                      match?.tournamentEdition?.logoUrl ||
                      match?.season?.logoUrl ||
                      match?.season?.league?.logoUrl ||
                      EmptyImageUrls.Tournament
                    }
                    alt={
                      `${match?.tournamentEdition?.tournament?.name} ${match?.tournamentEdition?.year}` ||
                      `${match?.season?.league?.name} ${match?.season?.year}`
                    }
                  />
                  <h3 className="text-center text-lg">
                  {match.tournamentOrLeagueName}
                </h3>
              </div>
                <div className="flex items-center gap-4 p-2 py-4">
                <Image
                    width={150}
                    height={150}
                    src={
                      match?.homeTeam?.flagUrl ||
                      EmptyImageUrls.Team
                    }
                    alt={match.homeTeam?.name || ""}
                    className="aspect-video object-contain"
                  />
                  <p className="flex-1 text-right text-xl mr-8">
                    {match.homeTeam?.name || ""}
                  </p>

                  <p className="font-semibold text-lg mx-16">
                    {(match.date &&
                      getFormattedTime(match.date?.toString(), true, false)) ||
                      ""}
                  </p>
                  
                  <p className="flex-1 text-xl ml-8">
                    {match.awayTeam?.name || ""}
                  </p>
                  <Image
                    width={150}
                    height={150}
                    src={
                      match?.awayTeam?.flagUrl ||
                      EmptyImageUrls.Team
                    }
                    alt={match.awayTeam?.name || ""}
                    className="aspect-video object-contain"
                  />

                </div>
                <p className="text-center text-sm">
                  {(match.date &&
                    getFormattedDate(match.date?.toString(), false)) ||
                    ""}
                </p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious variant="ghost" />
        <CarouselNext variant="ghost" />
      </Carousel>
    </div>
  );
}
