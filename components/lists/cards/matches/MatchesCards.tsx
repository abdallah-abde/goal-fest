"use client";

import {
  Match,
  Group,
  Team,
  KnockoutMatch,
  TournamentEdition,
  Tournament,
} from "@prisma/client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import * as _ from "lodash";

import { GroupIcon, CalendarDays } from "lucide-react";

import NoDataFoundComponent from "@/components/NoDataFoundComponent";
import MatchCard from "@/components/lists/cards/matches/MatchCard";
import MatchesFilterDialog from "@/components/lists/cards/matches/MatchesFilterDialog";
import ListTitle from "@/components/lists/ListTitle";
import PageHeader from "@/components/PageHeader";

import { NeutralMatch } from "@/types";
import { GroupByOptions } from "@/types/enums";

import {
  switchGroupMatchesToNeutralMatches,
  switchKnockoutMatchesToNeutralMatches,
} from "@/lib/data/switchers";

interface TournamentEditionProps extends TournamentEdition {
  tournament: Tournament;
  teams: Team[];
  groups: Group[];
}

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

export default function MatchesCards({
  tournamentEdition,
  matches,
  knockoutMatches,
  rounds,
}: {
  tournamentEdition: TournamentEditionProps;
  matches: MatchProps[];
  knockoutMatches: KnockoutMatchProps[];
  rounds: string[];
}) {
  const allMatches: NeutralMatch[] = switchGroupMatchesToNeutralMatches(
    matches
  ).concat(switchKnockoutMatchesToNeutralMatches(knockoutMatches));

  const [groupBy, setGroupBy] = useState<GroupByOptions>(
    GroupByOptions.ONLYDATE
  );
  const results = Object.entries(_.groupBy(allMatches, groupBy));

  return (
    <>
      <PageHeader
        label={`${tournamentEdition?.tournament.name} ${tournamentEdition?.yearAsString} Matches`}
      />
      <div className='flex justify-end pb-2'>
        <Button
          variant='outline'
          onClick={() => {
            setGroupBy(
              groupBy === GroupByOptions.STAGE
                ? GroupByOptions.ONLYDATE
                : GroupByOptions.STAGE
            );
          }}
          className='flex gap-2 border-2 border-secondary hover:border-primary/10'
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
          teams={tournamentEdition.teams}
          groups={tournamentEdition.groups}
          rounds={rounds}
        />
      </div>
      {results.length > 0 ? (
        <div className='flex flex-col gap-8'>
          {results.map(([divider, list], index) => {
            return (
              <div key={index} className='w-full'>
                <ListTitle groupBy={groupBy} divider={divider} />
                <div className='w-full space-y-2'>
                  {list.map((match: NeutralMatch) => (
                    <MatchCard key={match.dbId} match={match} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <NoDataFoundComponent message='Sorry, No Matches Found' />
      )}
    </>
  );
}
