import prisma from "@/lib/db";

import Image from "next/image";

import { NeutralMatch } from "@/types";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import {
  switchGroupMatchesToNeutralMatches,
  switchKnockoutMatchesToNeutralMatches,
  switchLeagueMatchesToNeutralMatches,
} from "@/lib/data/switchers";
import { getFormattedDate, getFormattedTime } from "@/lib/getFormattedDate";

export default async function FeaturedMatches() {
  const [matches, knockoutMatches, leagueMatches] = await Promise.all([
    prisma.match.findMany({
      where: {
        isFeatured: true,
      },
      include: {
        tournamentEdition: {
          include: {
            tournament: true,
            hostingCountries: true,
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
        season: { include: { league: { include: { country: true } } } },
      },
    }),
  ]);

  const allMatches: NeutralMatch[] = switchGroupMatchesToNeutralMatches(
    matches
  ).concat(
    switchKnockoutMatchesToNeutralMatches(knockoutMatches),
    switchLeagueMatchesToNeutralMatches(leagueMatches)
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
                <h3 className="text-center text-lg">
                  {match.tournamentEdition
                    ? match.tournamentEdition.tournament.name
                    : match.season?.league.name}
                </h3>
                <div className="flex items-center gap-4 p-2 py-4">
                  <p className="flex-1 text-right text-xl mr-8">
                    {match.homeTeam?.name || ""}
                  </p>
                  {match.homeTeam && match.homeTeam.flagUrl && (
                    <Image
                      width={50}
                      height={50}
                      src={match.homeTeam.flagUrl || ""}
                      alt="team"
                    />
                  )}
                  <p className="font-semibold text-lg mx-16">
                    {(match.date &&
                      getFormattedTime(match.date?.toString(), true, false)) ||
                      ""}
                  </p>
                  {match.awayTeam && match.awayTeam.flagUrl && (
                    <Image
                      width={50}
                      height={50}
                      src={match.awayTeam.flagUrl || ""}
                      alt="team"
                    />
                  )}
                  <p className="flex-1 text-xl ml-8">
                    {match.awayTeam?.name || ""}
                  </p>
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
