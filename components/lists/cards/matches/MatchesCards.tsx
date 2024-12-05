"use client";

import {
  Match,
  Group,
  Team,
  KnockoutMatch,
  TournamentEdition,
  Tournament,
  Country,
  LeagueMatch,
  LeagueGroup,
  LeagueTeam,
  LeagueSeason,
  League,
  LeagueKnockoutMatch,
} from "@prisma/client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import _ from "lodash";

import { GroupIcon, CalendarDays } from "lucide-react";

import NoDataFoundComponent from "@/components/NoDataFoundComponent";
import MatchCard from "@/components/lists/cards/matches/MatchCard";
import MatchesFilterDialog from "@/components/lists/cards/matches/MatchesFilterDialog";
import ListTitle from "@/components/lists/ListTitle";
import PageHeader from "@/components/PageHeader";

import { NeutralMatch } from "@/types";
import { GroupByOptions } from "@/types/enums";

import {
  switchTournamentMatchesToNeutralMatches,
  switchTournamentKnockoutMatchesToNeutralMatches,
  switchLeagueMatchesToNeutralMatches,
  switchLeagueKnockoutMatchesToNeutralMatches,
} from "@/lib/data/switchers";
import { sortMatches, sortMatchesByRound } from "@/lib/sortGroupTeams";

interface TournamentEditionProps extends TournamentEdition {
  tournament: Tournament;
  teams: Team[];
  groups: Group[];
  winner: Team | null;
  titleHolder: Team | null;
  hostingCountries: Country[];
}

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

interface LeagueProps extends League {
  country: Country | null;
}

interface LeagueSeasonProps extends LeagueSeason {
  league: LeagueProps;
  teams: LeagueTeam[];
  groups: LeagueGroup[];
  winner: LeagueTeam | null;
  titleHolder: LeagueTeam | null;
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

export default function MatchesCards({
  editionOrseason,
  matches,
  knockoutMatches,
  rounds,
  type,
}: {
  editionOrseason: TournamentEditionProps | LeagueSeasonProps;
  matches: MatchProps[] | LeagueMatchProps[];
  knockoutMatches: KnockoutMatchProps[] | LeagueKnockoutMatchProps[];
  rounds: string[];
  type: "tournaments" | "leagues";
}) {
  const allMatches: NeutralMatch[] =
    type === "tournaments"
      ? switchTournamentMatchesToNeutralMatches(matches as MatchProps[]).concat(
          switchTournamentKnockoutMatchesToNeutralMatches(
            knockoutMatches as KnockoutMatchProps[]
          )
        )
      : switchLeagueMatchesToNeutralMatches(
          matches as LeagueMatchProps[]
        ).concat(
          switchLeagueKnockoutMatchesToNeutralMatches(
            knockoutMatches as LeagueKnockoutMatchProps[]
          )
        );

  const [groupBy, setGroupBy] = useState<GroupByOptions>(
    GroupByOptions.ONLYDATE
  );
  const results = Object.entries(
    _.groupBy(
      allMatches.sort(
        groupBy === GroupByOptions.ONLYDATE ? sortMatches : sortMatchesByRound
      ),
      groupBy
    )
  );

  return (
    <>
      <PageHeader
        label={`${
          type === "tournaments"
            ? (editionOrseason as TournamentEditionProps).tournament.name
            : (editionOrseason as LeagueSeasonProps).league.name
        } ${editionOrseason.year} Matches`}
      />
      <div className="flex justify-end pb-2">
        <Button
          variant="outline"
          onClick={() => {
            setGroupBy(
              groupBy === GroupByOptions.STAGE
                ? GroupByOptions.ONLYDATE
                : GroupByOptions.STAGE
            );
          }}
          className="flex gap-2 border-2 border-secondary hover:border-primary/10"
        >
          {groupBy === GroupByOptions.STAGE ? (
            <>
              <CalendarDays /> Group by Date
            </>
          ) : (
            <>
              <GroupIcon /> Group by Stage
            </>
          )}
        </Button>
        <MatchesFilterDialog
          teams={editionOrseason.teams}
          groups={editionOrseason.groups}
          rounds={rounds}
        />
      </div>
      {results.length > 0 ? (
        <div className="flex flex-col gap-8">
          {results.map(([divider, list], index) => {
            return (
              <div key={index} className="w-full">
                <ListTitle groupBy={groupBy} divider={divider} />
                <div className="w-full space-y-2">
                  {list.map((match: NeutralMatch) => (
                    <MatchCard key={match.dbId} match={match} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <NoDataFoundComponent message="Sorry, No Matches Found" />
      )}
    </>
  );
}
