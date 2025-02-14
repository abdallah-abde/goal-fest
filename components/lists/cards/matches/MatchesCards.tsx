"use client";

import { Match, Group, Team, Country, Season, League } from "@prisma/client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import _ from "lodash";
import { format } from "date-fns";

import { GroupIcon, CalendarDays } from "lucide-react";

import NoDataFoundComponent from "@/components/NoDataFoundComponent";
import MatchCard from "@/components/lists/cards/matches/MatchCard";
import MatchesFilterDialog from "@/components/lists/cards/matches/MatchesFilterDialog";
import ListTitle from "@/components/lists/ListTitle";
import PageHeader from "@/components/PageHeader";

import { GroupByOptions } from "@/types/enums";
import { LeagueProps } from "@/types";
import Link from "next/link";

interface MatchProps extends Match {
  group: Group | null;
  homeTeam: Team | null;
  awayTeam: Team | null;
  season: SeasonProps;
}

interface SeasonProps extends Season {
  league: LeagueProps;
  teams: Team[];
  groups: Group[];
  winner: Team | null;
  titleHolder: Team | null;
}

export default function MatchesCards({
  season,
  matches,
  rounds,
}: {
  season: SeasonProps;
  matches: MatchProps[];
  rounds: string[];
}) {
  const [groupBy, setGroupBy] = useState<GroupByOptions>(
    GroupByOptions.ONLYDATE
  );
  const results = Object.entries(
    _.groupBy(
      matches,
      groupBy === GroupByOptions.ONLYDATE
        ? (match) => {
            if (match.date) {
              const dateOnly = format(new Date(match.date), "yyyy-MM-dd"); // Extract YYYY-MM-DD
              return dateOnly;
            }
          }
        : groupBy
    )
  );

  return (
    <>
      <PageHeader label={`${season.league.name} Matches`} />
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
          teams={season.teams}
          groups={season.groups}
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
                  {list.map((match) => (
                    <Link
                      key={match.id}
                      href={`/leagues/${season.slug}/matches/${match.id}`}
                    >
                      <MatchCard match={match} />
                    </Link>
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
