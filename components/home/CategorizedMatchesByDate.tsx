import Image from "next/image";

import { NeutralMatch } from "@/types";

import _ from "lodash";

import CategorizedMatchCard from "./CategorizedMatchCard";

export default function CategorizedMatchesByDate({
  allMatches,
}: {
  allMatches: NeutralMatch[];
}) {
  const results = Object.entries(_.groupBy(allMatches, "fullTournamentName"));

  return (
    <div>
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
                      {`${list[0].tournamentEdition.hostingCountries[0].name} ${
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
  );
}
