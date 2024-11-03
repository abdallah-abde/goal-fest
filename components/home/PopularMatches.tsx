"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

import _ from "lodash";

import useGeoLocation from "@/hooks/useGeoLocation";

import {
  LeagueSeasonProps,
  NeutralMatch,
  TournamentEditionProps,
} from "@/types";

import PartsTitle from "@/components/home/PartsTitle";
import CategorizedMatchCard from "@/components/home/CategorizedMatchCard";
import TorunamentOrLeagueAccordionLogo from "@/components/home/TorunamentOrLeagueAccordionLogo";

import { LoadingSpinner } from "@/components/LoadingComponents";
import { EmptyImageUrls } from "@/types/enums";

export default function PopularMatches({ date }: { date: string }) {
  const { location, loading: geoLocationLoading, error } = useGeoLocation();
  const [allMatches, setAllMatches] = useState<Array<NeutralMatch>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getMatches() {
      setIsLoading(true);

      try {
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

  if (isLoading || geoLocationLoading)
    return (
      <div className="flex gap-2 items-center">
        <LoadingSpinner />
        <span>Loading Popular Matches</span>
      </div>
    );

  if (allMatches.length === 0) return;

  const results = Object.entries(_.groupBy(allMatches, "fullTournamentName"));

  return (
    <div className="space-y-2">
      {/* popular League and tournament matches separated by leagues and tournaments, and filtered by date and country */}
      <PartsTitle title={`Popular League's and Tournament's Matches`} />
      <div className="space-y-2">
        {results.map(([tournamentName, list], idx) => {
          const {
            editionOrSeason,
            tournamentOrLeagueName,
            matchOf,
            fullTournamentName,
            editionOrSeasonSlug,
            editionOrSeasonLogoUrl,
          } = list[0];

          return (
            <div key={idx} className="w-full bg-primary/10">
              <div className="py-2 px-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <Image
                      width={25}
                      height={25}
                      src={
                        editionOrSeasonLogoUrl
                      }
                      alt={fullTournamentName
                      }
                    />
                    {/* <TorunamentOrLeagueAccordionLogo
                      type={matchOf}
                      editionOrSeason={editionOrSeason}
                      altText={fullTournamentName}
                    /> */}
                  </div>
                  <div className="flex flex-col justify-center items-start">
                    <Link
                      href={`/${matchOf}/${editionOrSeasonSlug}/info`}
                      className="font-bold"
                    >
                      {tournamentOrLeagueName}
                    </Link>
                    {matchOf === "tournaments" &&
                      editionOrSeason &&
                      (editionOrSeason as TournamentEditionProps)
                        .hostingCountries.length > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {`${
                            (editionOrSeason as TournamentEditionProps)
                              .hostingCountries[0].name
                          } ${
                            (editionOrSeason as TournamentEditionProps)
                              .hostingCountries.length > 1
                              ? " and others..."
                              : ""
                          }`}
                        </span>
                      )}
                    {matchOf === "leagues" &&
                      editionOrSeason &&
                      (editionOrSeason as LeagueSeasonProps).league &&
                      (editionOrSeason as LeagueSeasonProps).league.country && (
                        <span className="text-xs text-muted-foreground">
                          {(editionOrSeason as LeagueSeasonProps).league.country
                            ?.name || ""}
                        </span>
                      )}
                  </div>
                </div>
                <span className="text-xs">{editionOrSeason?.year || ""}</span>
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
