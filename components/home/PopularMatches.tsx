"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

import _ from "lodash";

import useGeoLocation from "@/hooks/useGeoLocation";

import { MatchProps } from "@/types";

import PartsTitle from "@/components/home/PartsTitle";
import CategorizedMatchCard from "@/components/home/CategorizedMatchCard";

import { LoadingSpinner } from "@/components/Skeletons";
import { EmptyImageUrls } from "@/types/enums";

export default function PopularMatches({ date }: { date: string }) {
  const { location, loading: geoLocationLoading, error } = useGeoLocation();
  const [matches, setMatches] = useState<Array<MatchProps>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getMatches() {
      setIsLoading(true);

      try {
        const res = await fetch(
          `/api/matches/popular/${date}/${location?.country}`
        );
        const data = await res.json();

        setMatches(data);

        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    }

    getMatches();
  }, [date, location?.country]);

  if (isLoading || geoLocationLoading)
    return (
      <div className="flex gap-2 items-center">
        <LoadingSpinner />
        <span>Loading Popular Matches...</span>
      </div>
    );

  if (matches.length === 0) return;

  const results = Object.entries(_.groupBy(matches, "season.league.name"));

  return (
    <div className="space-y-2">
      {/* popular League matches separated by leagues and filtered by date and country */}
      <PartsTitle title={`Popular League's Matches`} />
      <div className="space-y-2">
        {results.map(([leagueName, list], idx) => {
          const {
            season: {
              hostingCountries,
              flagUrl,
              year,
              slug,
              league: { name, country },
            },
          } = list[0];

          return (
            <div key={idx} className="w-full bg-primary/10">
              <div className="py-2 px-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <Image
                      width={25}
                      height={25}
                      src={flagUrl || EmptyImageUrls.League}
                      alt={`${name} ${year} Flag`}
                    />
                  </div>
                  <div className="flex flex-col justify-center items-start">
                    <Link href={`/leagues/${slug}/info`} className="font-bold">
                      {leagueName}
                    </Link>
                    {hostingCountries.length === 1 ? (
                      <span className="text-xs text-muted-foreground">
                        {`${hostingCountries[0].name}`}
                      </span>
                    ) : (
                      hostingCountries.length > 1 && (
                        <span className="text-xs text-muted-foreground">
                          {`${hostingCountries[0].name} and others...`}
                        </span>
                      )
                    )}
                    {hostingCountries.length === 0 && country && (
                      <span className="text-xs text-muted-foreground">
                        {country.name}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-xs">{year}</span>
              </div>
              <div>
                {list.map((match, idx) => (
                  <CategorizedMatchCard key={idx} match={match} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
