import { NeutralMatch } from "@/types";

import _ from "lodash";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import CategorizedMatchesByTournamentOrLeague from "@/components/home/CategorizedMatchesByTournamentOrLeague";

export default function CategorizedMatchesByCountry({
  allMatches,
}: {
  allMatches: NeutralMatch[];
}) {
  const results = Object.entries(_.groupBy(allMatches, "country"));

  return (
    <Accordion type="single" collapsible className="bg-primary/10">
      {results.map(([countryName, list]) => (
        <AccordionItem key={countryName} value={countryName}>
          <AccordionTrigger className="px-4 hover:no-underline">
            {countryName}
          </AccordionTrigger>
          <AccordionContent className="pb-0">
            <CategorizedMatchesByTournamentOrLeague matches={list} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
