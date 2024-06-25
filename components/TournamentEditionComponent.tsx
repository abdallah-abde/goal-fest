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

const TournamentEditionComponent = ({
  tournamentEdition,
}: {
  tournamentEdition: TournamentEdition;
}) => {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  return (
    <div>
      {tournamentEdition !== null ? (
        <div className='flex flex-col gap-y-16'>
          <div className='flex gap-x-16 items-center justify-between w-full '>
            <div className='flex basis-2/3 items-center justify-start gap-x-6'>
              <div className='flex flex-col justify-start items-center w-fit'>
                <Image
                  src={`/tournaments/${
                    tournamentEdition.logoUrl
                      ? tournamentEdition.logoUrl
                      : "tournament.png"
                  }`}
                  alt={`${
                    tournamentEdition.tournament.name
                  } ${tournamentEdition.year.toString()}`}
                  width={250}
                  height={250}
                />
              </div>
              <div className='flex flex-col items-center justify-start gap-y-16 '>
                <p>Hosted by</p>
                {tournamentEdition.hostingCountries.map((cou) => (
                  <span
                    key={cou.id}
                    className='text-sm underline font-semibold bg-slate-300 p-1 px-2 rounded w-fit'
                  >
                    {cou.name}
                  </span>
                ))}
              </div>
            </div>
            <div className='flex items-center gap-x-16 basis-1/3'>
              <div className='flex flex-col items-center gap-y-2'>
                {tournamentEdition.winner && (
                  <>
                    <p className='text-yellow-400 font-bold'>Title Holder</p>
                    <Image
                      src={`/teams/${
                        tournamentEdition.winner.flagUrl
                          ? tournamentEdition.winner.flagUrl
                          : ""
                      }`}
                      width={80}
                      height={80}
                      alt={tournamentEdition.winner.name}
                      className='shadow-2xl overflow-hidden rounded-full'
                    />
                    <p className='text-lg font-bold'>
                      {tournamentEdition.winner.name}
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className='flex flex-col items-center gap-2'>
              <p className='mb-12'>History</p>
              <div className=''>
                <Carousel
                  opts={{
                    align: "start",
                  }}
                  orientation='vertical'
                  className='w-full'
                >
                  <CarouselContent className='h-[78px]'>
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
                        <div className='w-[250px]'>
                          <Card>
                            <CardContent className='flex items-center justify-evenly p-2 gap-2'>
                              <p className='text-lg font-semibold italic basis-1'>
                                2020
                              </p>
                              <Image
                                src={`/teams/${_}.png`}
                                alt={_}
                                width={20}
                                height={20}
                                className='basis-1'
                              />
                              <p className='text-lg font-semibold basis-4'>
                                {_}
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
            </div>
          </div>
          <div className='flex flex-col gap-y-2 items-center'>
            <div className='flex flex-col gap-x-2'>
              <p className='text-center w-full'>
                <span className='text-sm bg-slate-300 rounded p-1 px-2'>
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
                className='w-full max-w-3xl'
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
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </div>
          <div>Today's Matches</div>
          <div>
            Stats / Top 3 Teams in Goals / Top 3 teams in clean sheet / ....
          </div>
        </div>
      ) : (
        <p>No Data to Present</p>
      )}
    </div>
  );
};

export default TournamentEditionComponent;
