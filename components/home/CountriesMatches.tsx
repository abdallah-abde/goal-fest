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

import PartsTitle from "@/components/home/PartsTitle";
import CategorizedMatchesByTournamentOrLeague from "@/components/home/CategorizedMatchesByTournamentOrLeague";

import { LoadingSpinner } from "@/components/LoadingComponents";
import Image from "next/image";
import { EmptyImageUrls } from "@/types/enums";

export default function CountriesMatches({ date }: { date: string }) {
  const [allMatches, setAllMatches] = useState<Array<NeutralMatch>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getMatches() {
      setIsLoading(true);
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

  if (isLoading)
    return (
      <div className="flex gap-2 items-center">
        <LoadingSpinner />
        <span>Loading Matches By Countries</span>
      </div>
    );

  if (allMatches.length === 0) return;

  const results = Object.entries(_.groupBy(allMatches, "country"));

  return (
    <div className="space-y-2 pb-24">
      <PartsTitle title={`League's and Tournament's Matches By Countries`} />
      <Accordion type="single" collapsible className="bg-primary/10">
        {results.map(([countryName, list], idx) => (
          <AccordionItem key={idx} value={countryName}>
            <AccordionTrigger className="px-4 hover:no-underline">
            <div className="flex gap-2 items-center">
                <Image
                  width={25}
                  height={25}
                  src={
                    list[0].countryflagUrl || EmptyImageUrls.Country
                  }
                  alt={`${countryName} Flag`}
                />
                <p>{countryName}</p>
              </div>
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
