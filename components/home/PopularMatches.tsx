"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import useGeoLocation from "@/hooks/useGeoLocation";

import { NeutralMatch } from "@/types";

import _ from "lodash";

import PartsTitle from "@/components/home/PartsTitle";
import CategorizedMatchCard from "@/components/home/CategorizedMatchCard";

import { LoadingSpinner } from "@/components/LoadingComponents";
import Link from "next/link";

export default function PopularMatches({ date }: { date: string }) {
  const { location, loading, error } = useGeoLocation();
  const [allMatches, setAllMatches] = useState<Array<NeutralMatch>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getMatches() {
      try {
        console.log(location);
        const res = await fetch(
          `/api/matches/popular/${date}/${location?.country}`
        );
        const data = await res.json();

        setAllMatches(data);

        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    }

    getMatches();
  }, [date, location?.country]);

  if (isLoading || loading) return <LoadingSpinner />;

  if (allMatches.length === 0) return;

  const results = Object.entries(_.groupBy(allMatches, "fullTournamentName"));

  return (
    <div className="space-y-2">
      {/* popular League and tournament matches separated by leagues and tournaments, and filtered by date and country */}
      <PartsTitle title={`Popular League's and Tournament's Matches`} />
      <div className="space-y-2">
        {results.map(([tournamentName, list], idx) => {
          const { tournamentEdition, season } = list[0];

          return (
            <div key={idx} className="w-full bg-primary/10">
              <div className="py-2 px-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-4">
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
                  <div className="flex flex-col justify-center items-start">
                    <Link
                      href={`/${
                        tournamentEdition
                          ? "tournaments"
                          : season
                          ? "leagues"
                          : ""
                      }/${
                        tournamentEdition
                          ? tournamentEdition?.slug
                          : season
                          ? season?.slug
                          : ""
                      }/info`}
                      className="font-bold"
                    >
                      {tournamentEdition
                        ? tournamentEdition?.tournament.name
                        : season?.league.name}
                    </Link>
                    {tournamentEdition &&
                      tournamentEdition.hostingCountries.length > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {`${tournamentEdition.hostingCountries[0].name} ${
                            tournamentEdition.hostingCountries.length > 1
                              ? " and others..."
                              : ""
                          }`}
                        </span>
                      )}
                    {season && season.league && season.league.country && (
                      <span className="text-xs text-muted-foreground">
                        {season.league.country.name}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-xs">
                  {tournamentEdition ? tournamentEdition.year : season?.year}
                </span>
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
