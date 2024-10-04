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
      {results.map(([tournamentName, list], idx) => (
        <AccordionItem key={tournamentName} value={tournamentName}>
          <AccordionTrigger className="px-4 pl-8 hover:no-underline">
            {tournamentName}
          </AccordionTrigger>
          <AccordionContent className="pb-0">
            {list.map((match, idx) => (
              <CategorizedMatchCard key={idx} match={match} />
            ))}
            <Button
              variant="link"
              className="text-center rounded-none w-full p-0 m-0 border-t-1 border-primary/25"
            >
              click for more
            </Button>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
