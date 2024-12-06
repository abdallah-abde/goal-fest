import _ from "lodash";
import Image from "next/image";
import { MatchProps } from "@/types";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import CategorizedMatchCard from "@/components/home/CategorizedMatchCard";
import PartsLink from "@/components/home/PartsLink";
import { EmptyImageUrls } from "@/types/enums";

export default function CategorizedMatchesByLeagues({
  matches,
}: {
  matches: MatchProps[];
}) {
  const results = Object.entries(_.groupBy(matches, "season.league.name"));

  return (
    <Accordion
      type="single"
      collapsible
      className="bg-primary/15 first:border-t-2 border-primary/50"
    >
      {results.map(([tournamentName, list], idx) => {
        const {
          season: {
            slug,
            flagUrl,
            year,
            league: { name },
          },
        } = list[0];

        return (
          <AccordionItem key={idx} value={tournamentName}>
            <AccordionTrigger className="px-4 pl-6 hover:no-underline">
              <div className="flex items-center gap-2">
                <div>
                  <Image
                    width={25}
                    height={25}
                    src={flagUrl || EmptyImageUrls.League}
                    alt={`${name} ${year} Flag`}
                  />
                </div>
                <p className="flex-1">{name}</p>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-0">
              {list.map((match, idx) => (
                <CategorizedMatchCard key={idx} match={match} />
              ))}
              <PartsLink
                href={`/league/${slug}/standings`}
                label="See Standings"
              />
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
