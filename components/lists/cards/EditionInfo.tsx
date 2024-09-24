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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import NoDataFoundComponent from "@/components/NoDataFoundComponent";
import TotalGoalsCard from "@/components/lists/cards/TotalGoalsCard";
import { TotalCleanSheetsProps, TotalGoalsProps } from "@/types/totalStats";
import TotalCleanSheetsCard from "./TotalCleanSheetsCards";
import PageHeader from "@/components/PageHeader";
import { NeutralMatch } from "@/types";
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
    return <NoDataFoundComponent message='Sorry, No Info Found' />;

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

  const allMatches: NeutralMatch[] = switchGroupMatchesToNeutralMatches(
    matches.filter((a) => a.date && a.date > new Date("July 05, 2024 21:00:00"))
  ).concat(
    switchKnockoutMatchesToNeutralMatches(
      knockoutMatches.filter(
        (a) => a.date && a.date > new Date("July 05, 2024 21:00:00")
      )
    )
  );

  console.log("ALL MATCHES", tournamentEdition.matches);

  return (
    <>
      <PageHeader label={`${tournament.name} ${yearAsString} Information`} />
      <div className='space-y-8'>
        {/* INFO CARDS */}
        <CardsSectionContainer className='*:sm:w-[calc((100%/3)-6px)] *:md:w-[calc((100%/4)-6px)]'>
          <>
            {/* TEAMS NUMBER */}
            {teams && teams.length > 0 && (
              <InfoCard label='Number of Teams'>{teams.length}</InfoCard>
            )}

            {/* CURRENT STAGE */}
            {currentStage && (
              <InfoCard label='Current Stage'>{currentStage}</InfoCard>
            )}

            {/* TITLE HOLDER */}
            {titleHolder && (
              <InfoCard label='Title Holder' badgeClassName='justify-between'>
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
              <InfoCard label='Winner' badgeClassName='justify-between'>
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
            label='Hosting Countries'
            className='*:sm:w-[calc((100%/3)-6px)] *:md:w-[calc((100%/4)-6px)]'
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
        <CardsSectionContainer label='Next Matches'>
          {Array.from({ length: 3 }).map((a, _) => (
            <Card key={_}>
              <CardContent className='flex flex-col gap-2 text-sm p-6 py-3'>
                <div className='flex items-center justify-between'>
                  <Badge
                    variant='green'
                    className='text-[10px] leading-3 sm:text-xs'
                  >
                    Sep 19
                  </Badge>
                  <Badge
                    variant='green'
                    className='text-[10px] leading-3 sm:text-xs'
                  >
                    11:30 PM
                  </Badge>
                </div>
                <div className='flex flex-col gap-0 border-y border-primary/10'>
                  {Array.from({ length: 2 }).map((a, _) => (
                    <div key={_} className='flex items-center gap-2 py-2'>
                      <Image
                        src='/images/teams/0d123b32-3ef7-45f6-ae83-ef099a4a5958-ukraine.png'
                        alt=''
                        width={25}
                        height={25}
                      />
                      <span className='hidden sm:block font-bold'>Germany</span>
                      <span className='hidden max-sm:block font-bold'>GER</span>
                    </div>
                  ))}
                </div>
                <div className='flex items-center justify-between text-xs'>
                  <Badge
                    variant='secondary'
                    className='text-[10px] leading-3 sm:text-xs'
                  >
                    Groups A
                  </Badge>
                  <Badge
                    variant='secondary'
                    className='text-[10px] leading-3 sm:text-xs'
                  >
                    Round 1
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardsSectionContainer>

        {/* STATISTICS CARDS */}
        {(teamsGoalsScored.length > 0 ||
          teamsGoalsAgainst.length > 0 ||
          teamsCleanSheets.length > 0) && (
          <CardsSectionContainer label='Statistics'>
            {teamsGoalsScored && (
              <TotalGoalsCard
                label='Most goals scored'
                teamsGoals={teamsGoalsScored}
              />
            )}
            {teamsGoalsAgainst && (
              <TotalGoalsCard
                label='Most goals conceded'
                teamsGoals={teamsGoalsAgainst}
              />
            )}
            {teamsCleanSheets && (
              <TotalCleanSheetsCard
                label='Most clean sheets'
                teamsCleanSheets={teamsCleanSheets}
              />
            )}
          </CardsSectionContainer>
        )}

        {/* TEAMS CARDS */}
        {teams && teams.length > 0 && (
          <CardsSectionContainer
            label='Teams'
            className='*:sm:w-[calc((100%/3)-6px)] *:md:w-[calc((100%/4)-6px)]'
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

function CardsSectionContainer({
  label,
  children,
  className,
}: {
  label?: string | null;
  children: React.ReactNode;
  className?: string | null;
}) {
  return (
    <div>
      {label && <h2 className='font-bold mb-2'>{label}</h2>}
      <div
        className={`flex flex-wrap justify-between gap-2 *:w-full *:xs:w-[calc((100%/2)-4px)] *:md:w-[calc((100%/3)-6px)] *:bg-primary/10 ${
          className || ""
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function InfoCard({
  label,
  children,
  badgeClassName,
}: {
  label: string;
  children: React.ReactNode;
  badgeClassName?: string | null;
}) {
  return (
    <Card className='flex flex-col justify-between gap-4 *:p-0 p-6'>
      <CardHeader>
        <CardTitle className='text-[16px] text-center'>{label}</CardTitle>
      </CardHeader>
      <CardContent className='flex place-content-center'>
        <Badge
          variant='secondary'
          className={`w-full flex items-center justify-center gap-2 font-bold border-2 py-[6px] hover:bg-secondary text-lg text-[16px] ${
            badgeClassName || ""
          }`}
        >
          {children}
        </Badge>
      </CardContent>
    </Card>
  );
}

function TeamOrCountryCard({
  id,
  name,
  flagUrl,
}: {
  id: number;
  name: string;
  flagUrl?: string | null;
}) {
  return (
    <Card
      key={id}
      className='bg-primary/10 flex flex-col-reverse justify-between items-center'
    >
      <CardHeader className='flex flex-row items-center justify-center'>
        <CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <p className='text-lg font-bold text-center truncate w-[10ch]'>
                  {name}
                </p>
              </TooltipTrigger>
              <TooltipContent>{name}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className='pt-6 pb-0'>
        {flagUrl && (
          <Image width={40} height={40} src={flagUrl} alt={name + " Flag"} />
        )}
      </CardContent>
    </Card>
  );
}
