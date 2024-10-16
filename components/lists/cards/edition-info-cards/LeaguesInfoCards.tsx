"use client";

import * as React from "react";
import Image from "next/image";

import {
  LeagueSeason,
  League,
  LeagueTeam,
  LeagueMatch,
  Country,
} from "@prisma/client";

import {
  LeagueTotalCleanSheetsProps,
  LeagueTotalGoalsProps,
} from "@/types/totalStats";
import { NeutralMatch } from "@/types";

import PageHeader from "@/components/PageHeader";
import CardsSectionContainer from "@/components/lists/cards/templates/CardsSectionContainer";
import InfoCard from "@/components/lists/cards/edition-info-cards/InfoCards";
import LeagueTeamsStats from "@/components/lists/cards/stats/LeagueTeamsStats";
import NextMatches from "@/components/lists/cards/matches/NextMatches";
import TeamOrCountryCard from "@/components/lists/cards/edition-info-cards/TeamOrCountryCard";

import { switchLeagueMatchesToNeutralMatches } from "@/lib/data/switchers";

interface LeagueProps extends League {
  country: Country | null;
}

interface LeagueMatchProps extends LeagueMatch {
  homeTeam: LeagueTeam;
  awayTeam: LeagueTeam;
  season: LeagueSeasonProps;
}

interface LeagueSeasonProps extends LeagueSeason {
  league: LeagueProps;
  teams: LeagueTeam[];
  winner: LeagueTeam | null;
  titleHolder: LeagueTeam | null;
  matches: LeagueMatchProps[];
}

export default function LeaguesInfoCards({
  leagueSeason,
  teamsGoalsScored,
  teamsGoalsAgainst,
  teamsCleanSheets,
}: {
  leagueSeason: LeagueSeasonProps;
  teamsGoalsScored: LeagueTotalGoalsProps[];
  teamsGoalsAgainst: LeagueTotalGoalsProps[];
  teamsCleanSheets: LeagueTotalCleanSheetsProps[];
}) {
  const { league, year, teams, currentStage, titleHolder, winner, matches } =
    leagueSeason;

  let counter = 0;

  const allMatches: NeutralMatch[] = switchLeagueMatchesToNeutralMatches(
    matches.filter((a) => {
      if (
        a.date &&
        a.date > new Date("July 05, 2024 21:00:00") &&
        counter < 3
      ) {
        counter++;
        return a;
      }
    })
  );

  return (
    <>
      <PageHeader label={`${league?.name} ${year} Information`} />
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
        {league.country && (
          <CardsSectionContainer
            label="Hosting Countries"
            className="*:sm:w-[calc((100%/3)-6px)] *:md:w-[calc((100%/4)-6px)]"
          >
            <TeamOrCountryCard
              id={league.country.id}
              name={league.country.name}
              flagUrl={league.country.flagUrl}
            />
          </CardsSectionContainer>
        )}

        {/* NEXT MATCHES CARDS */}
        <NextMatches allMatches={allMatches} />

        {/* STATISTICS CARDS */}
        <LeagueTeamsStats
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
