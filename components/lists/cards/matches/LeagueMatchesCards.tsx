"use client";

import {
  LeagueMatch,
  Group,
  LeagueTeam,
  LeagueSeason,
  League,
  Country,
} from "@prisma/client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import _ from "lodash";

import { GroupIcon, CalendarDays } from "lucide-react";

import NoDataFoundComponent from "@/components/NoDataFoundComponent";
import LeagueMatchesFilterDialog from "@/components/lists/cards/matches/LeagueMatchesFilterDialog";
import MatchCard from "@/components/lists/cards/matches/MatchCard";
import ListTitle from "@/components/lists/ListTitle";
import PageHeader from "@/components/PageHeader";

import { NeutralMatch } from "@/types";
import { GroupByOptions } from "@/types/enums";

import { switchLeagueMatchesToNeutralMatches } from "@/lib/data/switchers";
import { sortMatches } from "@/lib/sortGroupTeams";

interface LeagueProps extends League {
  country: Country | null;
}

interface LeagueSeasonProps extends LeagueSeason {
  league: LeagueProps;
  teams: LeagueTeam[];
  winner: LeagueTeam | null;
  titleHolder: LeagueTeam | null;
}

interface LeagueMatchProps extends LeagueMatch {
  homeTeam: LeagueTeam;
  awayTeam: LeagueTeam;
  season: LeagueSeasonProps;
}

export default function LeagueLeagueMatchesCards({
  leagueSeason,
  matches,
  rounds,
}: {
  leagueSeason: LeagueSeasonProps;
  matches: LeagueMatchProps[];
  rounds: string[];
}) {
  const allLeagueMatches: NeutralMatch[] =
    switchLeagueMatchesToNeutralMatches(matches);

  const [groupBy, setGroupBy] = useState<GroupByOptions>(
    GroupByOptions.ONLYDATE
  );
  const results = Object.entries(
    _.groupBy(allLeagueMatches.sort(sortMatches), groupBy)
  );

  return (
    <>
      <PageHeader
        label={`${leagueSeason?.league?.name} ${leagueSeason?.year} Matches`}
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
        <LeagueMatchesFilterDialog teams={leagueSeason.teams} rounds={rounds} />
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
        <NoDataFoundComponent message="Sorry, No LeagueMatches Found" />
      )}
    </>
  );
}
