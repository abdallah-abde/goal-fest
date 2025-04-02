import Image from "next/image";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { getFormattedDate, getFormattedTime } from "@/lib/getFormattedDate";
import { EmptyImageUrls } from "@/types/enums";
import { getMatches } from "@/lib/getMatches";
import PartsTitle from "@/app/(pages)/_components/PartsTitle";

export default async function FeaturedMatches() {
  const matches = await getMatches({
    isFeatured: true,
  });

  if (matches.length === 0) return <></>;

  return (
    <div className="space-y-2">
      {/* Today Important Matches slider */}
      <PartsTitle title={`Featured Matches`} />
      <Carousel className="w-full">
        <CarouselContent>
          {matches.map((match, idx) => (
            <CarouselItem key={idx}>
              <div className="bg-primary/10 py-4 px-2 md:px-10 space-y-4">
                <div className="flex gap-2 items-center justify-center">
                  <Image
                    width={50}
                    height={50}
                    src={
                      match?.season?.flagUrl ||
                      match?.season?.league?.flagUrl ||
                      EmptyImageUrls.League
                    }
                    alt={`${match?.season?.league?.name} ${match?.season?.year}`}
                    className="hidden max-xs:block aspect-video object-contain"
                  />
                  <Image
                    width={75}
                    height={75}
                    src={
                      match?.season?.flagUrl ||
                      match?.season?.league?.flagUrl ||
                      EmptyImageUrls.League
                    }
                    alt={`${match?.season?.league?.name} ${match?.season?.year}`}
                    className="hidden xs:block aspect-video object-contain"
                  />
                  <h3 className="text-center text-[16px] md:text-lg">
                    {match.season.league.name}
                  </h3>
                </div>
                <div className="flex items-center justify-center gap-2 md:gap-4 p-1 md:p-2 py-4">
                  <div className="flex items-center justify-center flex-col gap-2 md:flex-row">
                    <Image
                      width={50}
                      height={50}
                      src={match?.homeTeam?.flagUrl || EmptyImageUrls.Team}
                      alt={`${match.homeTeam?.name} flag` || "Team flag"}
                      className="hidden max-xs:block aspect-video object-contain"
                    />
                    <Image
                      width={75}
                      height={75}
                      src={match?.homeTeam?.flagUrl || EmptyImageUrls.Team}
                      alt={`${match.homeTeam?.name} flag` || "Team flag"}
                      className="hidden xs:block md:hidden aspect-video object-contain"
                    />
                    <Image
                      width={100}
                      height={100}
                      src={match?.homeTeam?.flagUrl || EmptyImageUrls.Team}
                      alt={`${match.homeTeam?.name} flag` || "Team flag"}
                      className="hidden md:block xl:hidden aspect-video object-contain"
                    />
                    <Image
                      width={125}
                      height={125}
                      src={match?.homeTeam?.flagUrl || EmptyImageUrls.Team}
                      alt={`${match.homeTeam?.name} flag` || "Team flag"}
                      className="hidden xl:block aspect-video object-contain"
                    />
                    <p className="hidden sm:inline-block text-[18px] sm:text-[20px] font-bold flex-1 text-center mr-8">
                      {match.homeTeam?.name || ""}
                    </p>
                    <p className="hidden max-sm:inline-block text-[16px] font-bold flex-1 text-center mr-0 tracking-wider">
                      {match.homeTeam?.code || match.homeTeam?.name || ""}
                    </p>
                  </div>

                  <p className="font-semibold text-sm md:text-lg mx-8 md:mx-16">
                    {(match.date &&
                      getFormattedTime(match.date?.toString(), true, false)) ||
                      ""}
                  </p>

                  <div className="flex flex-col-reverse items-center justify-center gap-2 md:flex-row">
                    <p className="hidden sm:inline-block text-[18px] sm:text-[20px] font-bold flex-1 text-center ml-8">
                      {match.awayTeam?.name || ""}
                    </p>
                    <p className="hidden max-sm:inline-block text-[16px] font-bold flex-1 text-center ml-0 tracking-wider">
                      {match.awayTeam?.code || match.awayTeam?.name || ""}
                    </p>
                    <Image
                      width={50}
                      height={50}
                      src={match?.awayTeam?.flagUrl || EmptyImageUrls.Team}
                      alt={`${match.awayTeam?.name} flag` || "Team flag"}
                      className="hidden max-xs:block aspect-video object-contain"
                    />
                    <Image
                      width={75}
                      height={75}
                      src={match?.awayTeam?.flagUrl || EmptyImageUrls.Team}
                      alt={`${match.awayTeam?.name} flag` || "Team flag"}
                      className="hidden xs:block md:hidden aspect-video object-contain"
                    />
                    <Image
                      width={100}
                      height={100}
                      src={match?.awayTeam?.flagUrl || EmptyImageUrls.Team}
                      alt={`${match.awayTeam?.name} flag` || "Team flag"}
                      className="hidden md:block xl:hidden aspect-video object-contain"
                    />
                    <Image
                      width={125}
                      height={125}
                      src={match?.awayTeam?.flagUrl || EmptyImageUrls.Team}
                      alt={`${match.awayTeam?.name} flag` || "Team flag"}
                      className="hidden xl:block aspect-video object-contain"
                    />
                  </div>
                </div>
                <p className="text-center text-sm md:text-lg">
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
