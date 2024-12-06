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

export default async function FeaturedMatches() {
  const matches = await getMatches({
    isFeatured: true,
  });

  if (matches.length === 0) return <></>;

  return (
    <div>
      {/* Today Important Matches slider */}
      <Carousel className="w-full">
        <CarouselContent>
          {matches.map((match, idx) => (
            <CarouselItem key={idx}>
              <div className="bg-primary/10 py-4 px-10 space-y-4">
                <div className="flex gap-2 items-center justify-center">
                  <Image
                    width={25}
                    height={25}
                    src={
                      match?.season?.flagUrl ||
                      match?.season?.league?.flagUrl ||
                      EmptyImageUrls.League
                    }
                    alt={`${match?.season?.league?.name} ${match?.season?.year}`}
                  />
                  <h3 className="text-center text-lg">
                    {match.season.league.name}
                  </h3>
                </div>
                <div className="flex items-center gap-4 p-2 py-4">
                  <Image
                    width={150}
                    height={150}
                    src={match?.homeTeam?.flagUrl || EmptyImageUrls.Team}
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
                    src={match?.awayTeam?.flagUrl || EmptyImageUrls.Team}
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
