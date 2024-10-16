import { NeutralMatch } from "@/types";

import _ from "lodash";

import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import CategorizedMatchCard from "@/components/home/CategorizedMatchCard";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

export default function CategorizedMatchesByTournamentOrLeague({
  matches,
}: {
  matches: NeutralMatch[];
}) {
  const results = Object.entries(_.groupBy(matches, "fullTournamentName"));

  return (
    <Accordion
      type="single"
      collapsible
      className="bg-primary/15 first:border-t-2 border-primary/50"
    >
      {results.map(([tournamentName, list], idx) => {
        const { tournamentEdition, season } = list[0];

        return (
          <AccordionItem key={idx} value={tournamentName}>
            <AccordionTrigger className="px-4 pl-6 hover:no-underline">
              <div className="flex items-center gap-2">
                <div>
                  {tournamentEdition && tournamentEdition.logoUrl && (
                    <Image
                      src={tournamentEdition.logoUrl}
                      alt={`${tournamentEdition.tournament.name} ${tournamentEdition.year}`}
                      width={25}
                      height={25}
                    />
                  )}
                  {season && season.logoUrl ? (
                    <Image
                      src={season.logoUrl}
                      alt={`${season.league.name} ${season.year}`}
                      width={25}
                      height={25}
                    />
                  ) : (
                    season?.league &&
                    season?.league.logoUrl && (
                      <Image
                        src={season?.league.logoUrl}
                        alt={`${season.league.name} ${season.year}`}
                        width={25}
                        height={25}
                      />
                    )
                  )}
                </div>
                <p className="flex-1">{tournamentName}</p>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-0">
              {list.map((match, idx) => (
                <CategorizedMatchCard key={idx} match={match} />
              ))}
              <Button
                variant="ghost"
                asChild
                className="text-center rounded-none w-full p-0 m-0 border-t-1 border-primary/25 hover:bg-transparent"
              >
                <Link
                  href={`/${
                    tournamentEdition ? "tournaments" : season ? "leagues" : ""
                  }/${
                    tournamentEdition
                      ? tournamentEdition?.slug
                      : season
                      ? season?.slug
                      : ""
                  }/info`}
                  className="font-bold flex items-center gap-2 hover:no-underline"
                >
                  {`${
                    tournamentEdition
                      ? tournamentEdition?.tournament.name
                      : season?.league.name
                  } standings`}
                  <ChevronRight size="15" />
                </Link>
              </Button>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
