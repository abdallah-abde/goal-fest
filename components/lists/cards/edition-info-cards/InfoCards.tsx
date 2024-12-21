"use client";

import * as React from "react";
import Image from "next/image";

import { Team, Country, Match, Group, Season, League } from "@prisma/client";

import { TotalCleanSheetsProps, TotalGoalsProps } from "@/types/totalStats";

import PageHeader from "@/components/PageHeader";
import CardsSectionContainer from "@/components/lists/cards/templates/CardsSectionContainer";
import TeamsStats from "@/components/lists/cards/stats/TeamsStats";
import InfoCard from "@/components/lists/cards/edition-info-cards/SingleInfoCard";
import NextMatches from "@/components/lists/cards/matches/NextMatches";
import TeamOrCountryCard from "@/components/lists/cards/edition-info-cards/TeamOrCountryCard";
import { LeagueProps } from "@/types";

interface MatchProps extends Match {
  group: Group | null;
  homeTeam: Team | null;
  awayTeam: Team | null;
}

interface SeasonProps extends Season {
  league: LeagueProps;
  teams: Team[];
  groups: Group[];
  winner: Team | null;
  titleHolder: Team | null;
  matches: MatchProps[];
  hostingCountries: Country[];
}

export default function InfoCards({
  season,
  teamsGoalsScored,
  teamsGoalsAgainst,
  teamsCleanSheets,
}: {
  season: SeasonProps;
  teamsGoalsScored: TotalGoalsProps[];
  teamsGoalsAgainst: TotalGoalsProps[];
  teamsCleanSheets: TotalCleanSheetsProps[];
}) {
  const { year, teams, currentStage, titleHolder, winner, matches } = season;

  let counter = 0;

  return (
    <>
      <PageHeader label={`${season.league.name} ${year} Information`} />
      <div className="space-y-8">
        {/* INFO CARDS */}
        <CardsSectionContainer className="*:sm:w-[calc((100%/3)-6px)] *:md:w-[calc((100%/4)-6px)]">
          <>
            {/* TEAMS NUMBER */}
            {teams && teams.length > 0 && (
              <InfoCard label="Number of Teams">{teams.length}</InfoCard>
            )}

            {/* CURRENT STAGE */}
            {currentStage && (
              <InfoCard label="Current Stage">{currentStage}</InfoCard>
            )}

            {/* TITLE HOLDER */}
            {titleHolder && (
              <InfoCard label="Title Holder" badgeClassName="justify-between">
                <>
                  <span>{titleHolder?.name}</span>
                  {titleHolder?.flagUrl && (
                    <Image
                      src={titleHolder?.flagUrl}
                      alt={titleHolder.name + " Flag"}
                      width={25}
                      height={25}
                    />
                  )}
                </>
              </InfoCard>
            )}

            {/* WINNER */}
            {winner && (
              <InfoCard label="Winner" badgeClassName="justify-between">
                <>
                  <span>{winner?.name}</span>
                  {winner?.flagUrl && (
                    <Image
                      src={winner?.flagUrl}
                      alt={winner.name + " Flag"}
                      width={25}
                      height={25}
                    />
                  )}
                </>
              </InfoCard>
            )}
          </>
        </CardsSectionContainer>

        {/* HOSTING COUNTRIES CARDS */}
        {season.hostingCountries && season.hostingCountries.length > 0 && (
          <CardsSectionContainer
            label="Hosting Countries"
            className="*:sm:w-[calc((100%/3)-6px)] *:md:w-[calc((100%/4)-6px)]"
          >
            {season.hostingCountries.map(({ id, name, flagUrl }) => (
              <TeamOrCountryCard
                key={id}
                id={id}
                name={name}
                flagUrl={flagUrl}
              />
            ))}
          </CardsSectionContainer>
        )}

        {season.hostingCountries.length === 0 && season.league.country && (
          <CardsSectionContainer
            label="Hosting Countries"
            className="*:sm:w-[calc((100%/3)-6px)] *:md:w-[calc((100%/4)-6px)]"
          >
            <TeamOrCountryCard
              id={season.league.country.id}
              name={season.league.country.name}
              flagUrl={season.league.country.flagUrl}
            />
          </CardsSectionContainer>
        )}

        {/* NEXT MATCHES CARDS */}
        <NextMatches
          matches={matches.filter((a) => {
            if (
              a.date &&
              a.date > new Date("July 05, 2024 21:00:00") &&
              counter < 3
            ) {
              counter++;
              return a;
            }
          })}
        />

        {/* STATISTICS CARDS */}
        <TeamsStats
          label="Statistics"
          teamsGoalsScored={teamsGoalsScored}
          teamsGoalsAgainst={teamsGoalsAgainst}
          teamsCleanSheets={teamsCleanSheets}
        />

        {/* TEAMS CARDS */}
        {teams && teams.length > 0 && (
          <CardsSectionContainer
            label="Teams"
            className="*:sm:w-[calc((100%/3)-6px)] *:md:w-[calc((100%/4)-6px)]"
          >
            {teams.map(({ id, name, flagUrl }) => (
              <TeamOrCountryCard
                key={id}
                id={id}
                name={name}
                flagUrl={flagUrl}
              />
            ))}
          </CardsSectionContainer>
        )}
      </div>
    </>
  );
}
