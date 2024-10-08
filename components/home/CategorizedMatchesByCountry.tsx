"use client";

import { useEffect, useState } from "react";

import { NeutralMatch } from "@/types";

import _ from "lodash";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import CategorizedMatchesByTournamentOrLeague from "@/components/home/CategorizedMatchesByTournamentOrLeague";
import { LoadingSpinner } from "@/components/LoadingComponents";

export default function CategorizedMatchesByCountry({
  date,
}: {
  date: string;
}) {
  const [allMatches, setAllMatches] = useState<Array<NeutralMatch>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getMatches() {
      try {
        const res = await fetch(`/api/matches/all/${date}`);
        const data = await res.json();

        setAllMatches(data);

        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    }

    getMatches();
  }, [date]);

  if (isLoading) return <LoadingSpinner />;

  if (allMatches.length === 0) return;

  const results = Object.entries(_.groupBy(allMatches, "country"));

  return (
    <div className="space-y-2 pb-24">
      <h3 className="text-muted-foreground text-sm mt-5">
        League&apos;s and Tournament&apos;s Matches By Countries
      </h3>
      <Accordion type="single" collapsible className="bg-primary/10">
        {results.map(([countryName, list], idx) => (
          <AccordionItem key={idx} value={countryName}>
            <AccordionTrigger className="px-4 hover:no-underline">
              {countryName}
            </AccordionTrigger>
            <AccordionContent className="pb-0">
              <CategorizedMatchesByTournamentOrLeague matches={list} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}