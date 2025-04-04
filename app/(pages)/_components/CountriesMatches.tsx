"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import _ from "lodash";

import { MatchProps } from "@/types";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import CategorizedMatchesByLeagues from "@/app/(pages)/_components/CategorizedMatchesByLeagues";

import { PopularMatchesSkeleton } from "@/components/Skeletons";
import { EmptyImageUrls } from "@/types/enums";
import RenderTitleBar from "@/app/(pages)/_components/RenderTitleBar";
import NoDataToShow from "@/app/(pages)/_components/NoDataToShow";

export default function CountriesMatches({ date }: { date: string }) {
  const [matches, setMatches] = useState<Array<MatchProps>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCountriesMatches, setShowCountriesMatches] = useState(true);

  useEffect(() => {
    async function getMatches() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/matches/all/${date}`);
        const data = await res.json();

        setMatches(data);

        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    }

    getMatches();
  }, [date]);

  if (isLoading)
    return <PopularMatchesSkeleton text="Loading Countries Matches..." />;

  if (matches.length === 0)
    return (
      <div className="space-y-2">
        <RenderTitleBar
          showSection={showCountriesMatches}
          setShowSection={setShowCountriesMatches}
          title="League's Matches By Countries"
          hideTooltipText="Hide Countries Matches"
          showTooltipText="Show Countries Matches"
        />
        {showCountriesMatches && (
          <NoDataToShow message="No Countries Matches Found" />
        )}
      </div>
    );

  const results = Object.entries(
    _.groupBy(matches, "season.league.country.name")
  );

  return (
    <div className="space-y-2 pb-0 lg:pb-24">
      <RenderTitleBar
        showSection={showCountriesMatches}
        setShowSection={setShowCountriesMatches}
        title="League's Matches By Countries"
        hideTooltipText="Hide Countries Matches"
        showTooltipText="Show Countries Matches"
      />
      {showCountriesMatches && (
        <Accordion type="single" collapsible className="bg-primary/10">
          {results.map(([country, list], idx) => {
            const {
              season: {
                league: {
                  country: { name: countryName, flagUrl: countryFlagUrl },
                },
              },
            } = list[0];

            return (
              <AccordionItem key={idx} value={countryName}>
                <AccordionTrigger className="px-4 hover:no-underline">
                  <div className="flex gap-2 items-center">
                    {country && (
                      <>
                        <Image
                          width={25}
                          height={25}
                          src={countryFlagUrl || EmptyImageUrls.Country}
                          alt={`${countryName} Flag`}
                        />
                        <p>{countryName}</p>
                      </>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-0">
                  <CategorizedMatchesByLeagues matches={list} />
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </div>
  );
}
