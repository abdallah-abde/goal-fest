"use client";

import * as React from "react";
import Image from "next/image";

import {
  TournamentEdition,
  Team,
  Tournament,
  Country,
  Match,
  KnockoutMatch,
  Group,
} from "@prisma/client";

import { TotalCleanSheetsProps, TotalGoalsProps } from "@/types/totalStats";
import { NeutralMatch } from "@/types";

import NoDataFoundComponent from "@/components/NoDataFoundComponent";
import PageHeader from "@/components/PageHeader";
import CardsSectionContainer from "@/components/lists/cards/templates/CardsSectionContainer";
import TeamsStats from "@/components/lists/cards/stats/TeamsStats";
import InfoCard from "@/components/lists/cards/edition-info-cards/InfoCards";
import NextMatches from "@/components/lists/cards/matches/NextMatches";
import TeamOrCountryCard from "@/components/lists/cards/edition-info-cards/TeamOrCountryCard";

import {
  switchGroupMatchesToNeutralMatches,
  switchKnockoutMatchesToNeutralMatches,
} from "@/lib/data/switchers";

interface KnockoutMatchProps extends KnockoutMatch {
  homeTeam: Team | null;
  awayTeam: Team | null;
  tournamentEdition: TournamentEdition;
}

interface MatchProps extends Match {
  group: Group;
  homeTeam: Team;
  awayTeam: Team;
  tournamentEdition: TournamentEdition;
}

interface TournamentEditionProps extends TournamentEdition {
  teams: Team[];
  tournament: Tournament;
  winner: Team | null;
  titleHolder: Team | null;
  hostingCountries: Country[];
  matches: MatchProps[];
  knockoutMatches: KnockoutMatchProps[];
}

export default function EditionInfo({
  tournamentEdition,
  teamsGoalsScored,
  teamsGoalsAgainst,
  teamsCleanSheets,
}: {
  tournamentEdition: TournamentEditionProps | null;
  teamsGoalsScored: TotalGoalsProps[];
  teamsGoalsAgainst: TotalGoalsProps[];
  teamsCleanSheets: TotalCleanSheetsProps[];
}) {
  if (!tournamentEdition)
    return <NoDataFoundComponent message="Sorry, No Info Found" />;

  const {
    tournament,
    yearAsString,
    teams,
    hostingCountries,
    currentStage,
    titleHolder,
    winner,
    matches,
    knockoutMatches,
  } = tournamentEdition;

  let counter = 0;

  const allMatches: NeutralMatch[] = switchGroupMatchesToNeutralMatches(
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
  ).concat(
    switchKnockoutMatchesToNeutralMatches(
      knockoutMatches.filter((a) => {
        if (
          a.date &&
          a.date > new Date("July 05, 2024 21:00:00") &&
          counter < 3
        ) {
          counter++;
          return a;
        }
      })
    )
  );

  return (
    <>
      <PageHeader label={`${tournament.name} ${yearAsString} Information`} />
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
        {hostingCountries && hostingCountries.length > 0 && (
          <CardsSectionContainer
            label="Hosting Countries"
            className="*:sm:w-[calc((100%/3)-6px)] *:md:w-[calc((100%/4)-6px)]"
          >
            {hostingCountries.map(({ id, name, flagUrl }) => (
              <TeamOrCountryCard
                key={id}
                id={id}
                name={name}
                flagUrl={flagUrl}
              />
            ))}
          </CardsSectionContainer>
        )}

        {/* NEXT MATCHES CARDS */}
        <NextMatches allMatches={allMatches} />

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
