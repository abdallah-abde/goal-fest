"use client";

import Image from "next/image";

import prisma from "@/lib/db";

import { NeutralMatch } from "@/types";

import _ from "lodash";

import CategorizedMatchCard from "./CategorizedMatchCard";
import useGeoLocation from "@/hooks/useGeoLocation";
import { useEffect, useState } from "react";
import {
  switchGroupMatchesToNeutralMatches,
  switchKnockoutMatchesToNeutralMatches,
  switchLeagueMatchesToNeutralMatches,
} from "@/lib/data/switchers";
import {
  getDateValueForDateTimeInput,
  getStartAndEndDates,
} from "@/lib/getFormattedDate";
import { LoadingSpinner } from "../LoadingComponents";

export default function CategorizedMatchesByDate({ date }: { date: string }) {
  const [allMatches, setAllMatches] = useState<Array<NeutralMatch>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { location, loading, error } = useGeoLocation();

  useEffect(() => {
    async function getMatches() {
      try {
        const res = await fetch(`/api/matches/${date}/${location?.country}`);
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

  if (isLoading || loading) return <LoadingSpinner />;

  if (allMatches.length === 0) return <div>No Data Found</div>;

  const results = Object.entries(_.groupBy(allMatches, "fullTournamentName"));

  return (
    <div className="space-y-2">
      {/* popular League and tournament matches separated by leagues and tournaments, and filtered by date */}
      <h3 className="text-muted-foreground text-sm mt-5">
        Popular League&apos;s and Tournament&apos;s Matches
      </h3>
      <div className="space-y-2">
        {results.map(([tournamentName, list], idx) => (
          <div key={idx} className="w-full bg-primary/10">
            <div className="py-2 px-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-4">
                {list[0].tournamentEdition &&
                  list[0].tournamentEdition.logoUrl && (
                    <Image
                      src={list[0].tournamentEdition.logoUrl}
                      alt={`${list[0].tournamentEdition.tournament.name} ${list[0].tournamentEdition.yearAsString}}`}
                      width={25}
                      height={25}
                    />
                  )}
                {list[0].season && list[0].season.logoUrl ? (
                  <Image
                    src={list[0].season.logoUrl}
                    alt={`${list[0].season.league.name} ${list[0].season.year}}`}
                    width={25}
                    height={25}
                  />
                ) : (
                  list[0].season?.league &&
                  list[0].season?.league.logoUrl && (
                    <Image
                      src={list[0].season?.league.logoUrl}
                      alt={`${list[0].season.league.name} ${list[0].season.year}}`}
                      width={25}
                      height={25}
                    />
                  )
                )}
                <div className="flex flex-col justify-center items-start">
                  <p className="font-bold">
                    {list[0].tournamentEdition
                      ? list[0].tournamentEdition.tournament.name
                      : list[0].season?.league.name}
                  </p>
                  {list[0].tournamentEdition &&
                    list[0].tournamentEdition.hostingCountries.length > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {`${
                          list[0].tournamentEdition.hostingCountries[0].name
                        } ${
                          list[0].tournamentEdition.hostingCountries.length > 1
                            ? " and others..."
                            : ""
                        }`}
                      </span>
                    )}
                  {list[0].season &&
                    list[0].season.league &&
                    list[0].season.league.country && (
                      <span className="text-xs text-muted-foreground">
                        {list[0].season.league.country.name}
                      </span>
                    )}
                </div>
              </div>
              <span className="text-xs">
                {list[0].tournamentEdition
                  ? list[0].tournamentEdition.yearAsString
                  : list[0].season?.year}
              </span>
            </div>
            <div>
              {list.map((match, idx) => (
                <CategorizedMatchCard key={idx} match={match} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
