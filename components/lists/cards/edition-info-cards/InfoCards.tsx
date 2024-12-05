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
  LeagueSeason,
  League,
  LeagueTeam,
  LeagueMatch,
  LeagueKnockoutMatch,
  LeagueGroup,
} from "@prisma/client";

import { TotalCleanSheetsProps, TotalGoalsProps } from "@/types/totalStats";
import { NeutralMatch } from "@/types";

import PageHeader from "@/components/PageHeader";
import CardsSectionContainer from "@/components/lists/cards/templates/CardsSectionContainer";
import TeamsStats from "@/components/lists/cards/stats/TeamsStats";
import InfoCard from "@/components/lists/cards/edition-info-cards/SingleInfoCard";
import NextMatches from "@/components/lists/cards/matches/NextMatches";
import TeamOrCountryCard from "@/components/lists/cards/edition-info-cards/TeamOrCountryCard";

import {
  switchTournamentMatchesToNeutralMatches,
  switchTournamentKnockoutMatchesToNeutralMatches,
  switchLeagueMatchesToNeutralMatches,
  switchLeagueKnockoutMatchesToNeutralMatches,
} from "@/lib/data/switchers";
import { sortMatches } from "@/lib/sortGroupTeams";

interface KnockoutMatchProps extends KnockoutMatch {
  homeTeam: Team | null;
  awayTeam: Team | null;
  tournamentEdition: TournamentEditionProps;
}

interface MatchProps extends Match {
  group: Group;
  homeTeam: Team;
  awayTeam: Team;
  tournamentEdition: TournamentEditionProps;
}

interface TournamentEditionProps extends TournamentEdition {
  tournament: Tournament;
  teams: Team[];
  groups: Group[];
  winner: Team | null;
  titleHolder: Team | null;
  hostingCountries: Country[];
  matches: MatchProps[];
  knockoutMatches: KnockoutMatchProps[];
}

interface LeagueMatchProps extends LeagueMatch {
  group: LeagueGroup | null;
  homeTeam: LeagueTeam;
  awayTeam: LeagueTeam;
  season: LeagueSeasonProps;
}
interface LeagueKnockoutMatchProps extends LeagueKnockoutMatch {
  homeTeam: LeagueTeam | null;
  awayTeam: LeagueTeam | null;
  season: LeagueSeasonProps;
}

interface LeagueSeasonProps extends LeagueSeason {
  league: LeagueProps;
  teams: LeagueTeam[];
  groups: LeagueGroup[];
  winner: LeagueTeam | null;
  titleHolder: LeagueTeam | null;
  matches: LeagueMatchProps[];
  knockoutMatches: LeagueKnockoutMatchProps[];
}

interface LeagueProps extends League {
  country: Country | null;
}

export default function InfoCards({
  editionOrSeason,
  teamsGoalsScored,
  teamsGoalsAgainst,
  teamsCleanSheets,
  type,
}: {
  editionOrSeason: TournamentEditionProps | LeagueSeasonProps;
  teamsGoalsScored: TotalGoalsProps[];
  teamsGoalsAgainst: TotalGoalsProps[];
  teamsCleanSheets: TotalCleanSheetsProps[];
  type: "tournaments" | "leagues";
}) {
  const {
    year,
    teams,
    currentStage,
    titleHolder,
    winner,
    matches,
    knockoutMatches,
  } = editionOrSeason;

  const tournamentName =
    type === "tournaments"
      ? (editionOrSeason as TournamentEditionProps).tournament.name
      : (editionOrSeason as LeagueSeasonProps).league.name;

  const tournamentHostingCountries =
    type === "tournaments"
      ? (editionOrSeason as TournamentEditionProps).hostingCountries
      : null;

  const leagueCountry =
    type === "leagues"
      ? (editionOrSeason as LeagueSeasonProps).league.country
      : null;

  let counter = 0;

  const allMatches: NeutralMatch[] =
    type === "tournaments"
      ? switchTournamentMatchesToNeutralMatches(
          (matches as MatchProps[])
            .sort((a, b) => {
              if (a.date && b.date)
                if (a.date > b.date) {
                  return -1;
                } else if (a.date < b.date) {
                  return 1;
                } else {
                  return 0;
                }

              return 0;
            })
            .reverse()
            .filter((a) => {
              if (a.date && a.date > new Date() && counter < 3) {
                counter++;
                return a;
              }
            })
        ).concat(
          switchTournamentKnockoutMatchesToNeutralMatches(
            (knockoutMatches as KnockoutMatchProps[])
              .sort((a, b) => {
                if (a.date && b.date)
                  if (a.date > b.date) {
                    return -1;
                  } else if (a.date < b.date) {
                    return 1;
                  } else {
                    return 0;
                  }

                return 0;
              })
              .reverse()
              .filter((a) => {
                if (a.date && a.date > new Date() && counter < 3) {
                  counter++;
                  return a;
                }
              })
          )
        )
      : switchLeagueMatchesToNeutralMatches(
          (matches as LeagueMatchProps[])
            .sort((a, b) => {
              if (a.date && b.date)
                if (a.date > b.date) {
                  return -1;
                } else if (a.date < b.date) {
                  return 1;
                } else {
                  return 0;
                }

              return 0;
            })
            .reverse()
            .filter((a) => {
              if (a.date && a.date > new Date() && counter < 3) {
                counter++;
                return a;
              }
            })
        ).concat(
          switchLeagueKnockoutMatchesToNeutralMatches(
            (knockoutMatches as LeagueKnockoutMatchProps[])
              .sort((a, b) => {
                if (a.date && b.date)
                  if (a.date > b.date) {
                    return -1;
                  } else if (a.date < b.date) {
                    return 1;
                  } else {
                    return 0;
                  }

                return 0;
              })
              .reverse()
              .filter((a) => {
                if (a.date && a.date > new Date() && counter < 3) {
                  counter++;
                  return a;
                }
              })
          )
        );

  return (
    <>
      <PageHeader label={`${tournamentName} ${year} Information`} />
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
        {tournamentHostingCountries &&
          tournamentHostingCountries.length > 0 && (
            <CardsSectionContainer
              label="Hosting Countries"
              className="*:sm:w-[calc((100%/3)-6px)] *:md:w-[calc((100%/4)-6px)]"
            >
              {tournamentHostingCountries.map(({ id, name, flagUrl }) => (
                <TeamOrCountryCard
                  key={id}
                  id={id}
                  name={name}
                  flagUrl={flagUrl}
                />
              ))}
            </CardsSectionContainer>
          )}

        {leagueCountry && (
          <CardsSectionContainer
            label="Hosting Countries"
            className="*:sm:w-[calc((100%/3)-6px)] *:md:w-[calc((100%/4)-6px)]"
          >
            <TeamOrCountryCard
              id={leagueCountry.id}
              name={leagueCountry.name}
              flagUrl={leagueCountry.flagUrl}
            />
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
