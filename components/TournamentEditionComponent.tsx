"use client";

import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { TournamentEdition } from "@/typings";
import { Card, CardContent } from "./ui/card";
import NoDataFound from "./NoDataFound";

const TournamentEditionComponent = ({
  tournamentEdition,
}: {
  tournamentEdition: TournamentEdition;
}) => {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  return (
    <>
      {tournamentEdition !== null ? (
        <div className='grid grid-cols-4 grid-rows-3 gap-4 gap-y-8 ml-auto '>
          <div className='col-start-1 row-start-1 grid justify-center'>
            <Image
              src={
                tournamentEdition.logoUrl
                  ? tournamentEdition.logoUrl
                  : "/tournaments/tournament.png"
              }
              alt={
                tournamentEdition.logoUrl
                  ? `${
                      tournamentEdition.tournament.name
                    } ${tournamentEdition.year.toString()}`
                  : "Tournament Logo"
              }
              width={250}
              height={350}
            />
          </div>
          <div className='col-start-2 row-start-1 grid justify-center place-content-start'>
            <p className='text-yellow-400 font-bold mb-2 text-center'>
              Hosted by
            </p>
            <div className='flex flex-wrap items-start justify-center gap-4'>
              {tournamentEdition.hostingCountries.map((cou) => (
                <div
                  key={cou.id}
                  className='flex flex-col max-w-16 min-w-16 gap-y-1'
                >
                  <Image
                    src={`/teams/${
                      cou.flagUrl ? cou.flagUrl : cou.name + ".png"
                    }`}
                    width={30}
                    height={30}
                    alt={cou.name}
                    className='shadow-2xl object-contain rounded-full mx-auto'
                  />
                  <p className='text-sm font-bold text-center'>{cou.name}</p>
                </div>
              ))}
            </div>
          </div>
          <div className='col-start-3 row-start-1 grid justify-center place-content-start'>
            {tournamentEdition.winner && (
              <>
                <p className='text-yellow-400 font-bold mb-2'>Title Holder</p>
                <Image
                  src={`/teams/${
                    tournamentEdition.winner.flagUrl
                      ? tournamentEdition.winner.flagUrl
                      : ""
                  }`}
                  width={80}
                  height={80}
                  alt={tournamentEdition.winner.name}
                  className='shadow-2xl object-contain rounded-full mx-auto mb-2'
                />
                <p className='text-lg font-bold text-center'>
                  {tournamentEdition.winner.name}
                </p>
              </>
            )}
          </div>
          <div className='col-start-4 row-span-full'>
            <p className='mb-14 text-center text-yellow-400 font-bold'>
              History of Tournament
            </p>
            <Carousel
              opts={{
                align: "start",
              }}
              orientation='vertical'
              className='w-full'
            >
              <CarouselContent className='h-[325px]'>
                {[
                  "italy",
                  "spain",
                  "germany",
                  "france",
                  "italy",
                  "spain",
                  "germany",
                  "france",
                ].map((_, index) => (
                  <CarouselItem key={index} className='basis-1'>
                    <div className='w-[250px] mx-auto'>
                      <Card className='bg-secondary-foreground/80 text-secondary'>
                        <CardContent className='flex justify-between p-2'>
                          <p className='text-lg font-semibold italic flex-grow'>
                            2020
                          </p>
                          <p className='text-lg font-semibold flex-grow'>{_}</p>
                          <Image
                            src={`/teams/${_}.png`}
                            alt={_}
                            width={20}
                            height={20}
                            className='object-contain'
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious variant={"default"} />
              <CarouselNext variant={"default"} />
            </Carousel>
          </div>
          <div className='col-start-1 col-end-4 row-start-2 flex flex-col justify-end items-end'>
            <p className='text-center w-full text-yellow-400 font-bold'>
              <span className='text-sm bg-yellow-400 text-foreground font-semibold rounded p-1 px-2'>
                {tournamentEdition.teams.length}
              </span>{" "}
              National Teams
            </p>
            <Carousel
              plugins={[plugin.current]}
              opts={{
                align: "start",
                loop: true,
              }}
              onMouseEnter={plugin.current.stop}
              onMouseLeave={() => plugin.current.play()}
              className='w-full max-w-2xl mx-auto'
            >
              <CarouselContent>
                {tournamentEdition.teams.map((team) => (
                  <CarouselItem key={team.id} className='basis-1/6'>
                    <div className='p-1'>
                      <div className='flex flex-col aspect-square items-center justify-center p-6'>
                        <Image
                          src={`/teams/${team.flagUrl}`}
                          alt={team.name}
                          width={25}
                          height={25}
                        />
                        <span className='text-md font-semibold'>
                          {team.name}
                        </span>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious variant={"default"} />
              <CarouselNext variant={"default"} />
            </Carousel>
          </div>
          {/* <div>Today's Matches</div>
          <div>
            Stats / Top 3 Teams in Goals / Top 3 teams in clean sheet / ....
          </div> */}
        </div>
      ) : (
        <NoDataFound message='Sorry, No Data Found' />
      )}
    </>
  );
};

export default TournamentEditionComponent;
