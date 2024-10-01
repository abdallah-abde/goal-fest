import prisma from "@/lib/db";

import TournamentsCards from "@/components/lists/cards/TournamentsCards";
import NextMatches from "@/components/lists/cards/matches/NextMatches";
import { NeutralMatch } from "@/types";
import {
  switchGroupMatchesToNeutralMatches,
  switchKnockoutMatchesToNeutralMatches,
} from "@/lib/data/switchers";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const tournaments = await prisma.tournament.findMany();

  // return <TournamentsCards tournaments={tournaments} />;

  const matches = await prisma.match.findMany({
    take: 3,
    include: {
      tournamentEdition: true,
      homeTeam: true,
      awayTeam: true,
      group: true,
    },
  });
  const knockoutMatches = await prisma.knockoutMatch.findMany({
    take: 3,
    include: { tournamentEdition: true, homeTeam: true, awayTeam: true },
  });

  const allMatches: NeutralMatch[] = switchGroupMatchesToNeutralMatches(
    matches
  ).concat(switchKnockoutMatchesToNeutralMatches(knockoutMatches));

  return (
    <div className="h-screen py-24 flex gap-4">
      <div className="w-1/3 pb-24 *:my-2">
        <div className="w-full bg-primary/10 p-4 flex justify-between">
          <ChevronLeft className="border rounded-full p-[.125rem] cursor-pointer" />
          <p>Calender</p>
          <ChevronRight className="border rounded-full p-[.125rem] cursor-pointer" />
        </div>
        <div className="space-y-2">
          {/* Today Matches with filter by date + important League matches separated
          by leagues */}
          {Array.from({ length: 3 }).map((a, idx) => (
            <div key={idx} className="w-full bg-primary/10">
              <h3 className="p-3 px-4 border-b font-bold">Jordan Cup</h3>
              <div className="">
                {Array.from({ length: 5 }).map((a, idx) => (
                  <div key={idx} className="border-b">
                    <div className="flex items-center gap-4 p-2 py-4">
                      <p className="flex-1 text-right text-sm">Team 1</p>
                      <Image
                        width={25}
                        height={25}
                        src="/images/teams/d87feb39-e41a-4237-9ee0-7749ef89d50e-germany (1).png"
                        alt="team"
                      />
                      <p className="font-semibold text-sm">18:00</p>
                      <Image
                        width={25}
                        height={25}
                        src="/images/teams/d87feb39-e41a-4237-9ee0-7749ef89d50e-germany (1).png"
                        alt="team"
                      />
                      <p className="flex-1 text-sm">Team 2</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="pb-24">
          {/* Matches & Leagues by countries */}
          <Accordion type="single" collapsible className="bg-primary/10">
            {Array.from({ length: 5 }).map((a, idx) => (
              <AccordionItem key={idx} value={"jordan" + idx}>
                <AccordionTrigger className="px-4 hover:no-underline">
                  Jordan {idx}
                </AccordionTrigger>
                <AccordionContent className="pb-0">
                  {Array.from({ length: 4 }).map((a, idx) => (
                    <Accordion
                      key={idx}
                      type="single"
                      collapsible
                      className="bg-primary/20 first:border-t-2 border-primary/50"
                    >
                      <AccordionItem value={"jordan-cup" + idx}>
                        <AccordionTrigger className="px-4 pl-8 hover:no-underline">
                          Jordan Cup {idx}
                        </AccordionTrigger>
                        <AccordionContent className="pb-0">
                          {Array.from({ length: 5 }).map((a, idx) => (
                            <div
                              key={idx}
                              className="first:border-t-2 border-primary/25 border-b-2"
                            >
                              <div className="flex items-center gap-4 p-2 py-4">
                                <p className="flex-1 text-right text-sm">
                                  Team 1
                                </p>
                                <Image
                                  width={25}
                                  height={25}
                                  src="/images/teams/d87feb39-e41a-4237-9ee0-7749ef89d50e-germany (1).png"
                                  alt="team"
                                />
                                <p className="font-semibold text-sm">18:00</p>
                                <Image
                                  width={25}
                                  height={25}
                                  src="/images/teams/d87feb39-e41a-4237-9ee0-7749ef89d50e-germany (1).png"
                                  alt="team"
                                />
                                <p className="flex-1 text-sm">Team 2</p>
                              </div>
                            </div>
                          ))}
                          <Button
                            variant="link"
                            className="text-center rounded-none w-full p-0 m-0 border-t-1 border-primary/25"
                          >
                            click for more
                          </Button>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
      <div className="w-2/3">
        <div>Today Importannt Matches slider</div>
        <div>Goalers for most important leagues</div>
        <div>Most important today League table</div>
        <div>
          <div>Popular Leagues</div>
          <div>Popular teams</div>
        </div>
      </div>
    </div>
  );
}
