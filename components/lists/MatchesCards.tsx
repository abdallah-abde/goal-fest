"use client";

import {
  Match,
  Group,
  Team,
  KnockoutMatch,
  TournamentEdition,
} from "@prisma/client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import * as _ from "lodash";

import { Filter } from "lucide-react";

import NoDataFoundComponent from "@/components/NoDataFoundComponent";
import MatchCard from "@/components/lists/MatchCard";
import ListTitle from "@/components/lists/ListTitle";

import { NeutralMatch } from "@/typings";

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

export default async function MatchesCards({
  matches,
  knockoutMatches,
}: {
  matches: MatchProps[];
  knockoutMatches: KnockoutMatchProps[];
}) {
  const allMatches: NeutralMatch[] = switchGroupMatchesToNeutralMatches(
    matches
  ).concat(switchKnockoutMatchesToNeutralMatches(knockoutMatches));

  const [groupBy, setGroupBy] = useState("onlyDate");
  const results = Object.entries(_.groupBy(allMatches, groupBy));

  return (
    <>
      {results.length > 0 ? (
        <>
          <div className='flex justify-end pb-2'>
            <Button
              variant='outline'
              onClick={() => {
                setGroupBy(groupBy === "stage" ? "onlyDate" : "stage");
              }}
              className='flex gap-2 border-2 border-secondary hover:border-primary/10'
            >
              <Filter />
              Group by {groupBy === "stage" ? "Date" : "Stage"}
            </Button>
          </div>
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
        </>
      ) : (
        <NoDataFoundComponent message='Sorry, No Matches Found' />
      )}
    </>
  );
}
