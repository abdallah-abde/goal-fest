"use client";

import {
  Match,
  Group,
  Team,
  KnockoutMatch,
  TournamentEdition,
} from "@prisma/client";

import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import Image from "next/image";

import * as _ from "lodash";

import { Filter } from "lucide-react";

import { getFormattedDate, getFormattedTime } from "@/lib/getFormattedDate";

import NoDataFoundComponent from "@/components/NoDataFoundComponent";

import { NeutralMatch } from "@/typings";

import { useMediaQuery } from "react-responsive";

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
  const isSmall = useMediaQuery({ query: "(min-width: 515px)" });

  const allMatches = new Array<NeutralMatch>();

  matches.forEach((match) => {
    const newMatch: NeutralMatch = {
      dbId: match.id,
      id: crypto.randomUUID(),
      type: "GROUP",
      tournamentEdition: match.tournamentEdition,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      homeGoals: match.homeGoals,
      awayGoals: match.awayGoals,
      homeExtraTimeGoals: null,
      awayExtraTimeGoals: null,
      homePenaltyGoals: null,
      awayPenaltyGoals: null,
      date: match.date,
      group: match.group,
      round: match.round,
      homeTeamPlacehlder: null,
      awayTeamPlacehlder: null,
      stage: "Groups Stage",
    };
    allMatches.push(newMatch);
  });

  knockoutMatches.forEach((match) => {
    const newMatch: NeutralMatch = {
      dbId: match.id,
      id: crypto.randomUUID(),
      type: "KNOCKOUT",
      tournamentEdition: match.tournamentEdition,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      homeGoals: match.homeGoals,
      awayGoals: match.awayGoals,
      homeExtraTimeGoals: match.homeExtraTimeGoals,
      awayExtraTimeGoals: match.awayExtraTimeGoals,
      homePenaltyGoals: match.homePenaltyGoals,
      awayPenaltyGoals: match.awayPenaltyGoals,
      date: match.date,
      group: null,
      round: match.round,
      homeTeamPlacehlder: match.homeTeamPlacehlder,
      awayTeamPlacehlder: match.awayTeamPlacehlder,
      stage: match.round || "",
    };
    allMatches.push(newMatch);
  });

  // const results = Object.entries(
  //   _.groupBy(allMatches, (item) =>
  //     getFormattedDate(item.date ? item.date?.toDateString() : "")
  //   )
  // );

  const [groupBy, setGroupBy] = useState("date");
  const results = Object.entries(_.groupBy(allMatches, groupBy));

  return (
    <>
      {results.length > 0 ? (
        <>
          <div className='flex justify-end pb-2'>
            <Button
              variant='outline'
              onClick={() => {
                setGroupBy(groupBy === "stage" ? "date" : "stage");
              }}
              className='flex gap-2 border-2 border-secondary hover:border-primary/10'
            >
              <Filter />
              Group by {groupBy === "stage" ? "Date" : "Stage"}
            </Button>
          </div>
          <div className='flex flex-col gap-8'>
            {results.map(([divider, list], _) => {
              // const matchDate = getFormattedDate(divider);
              return (
                <div key={_}>
                  <p className='text-[14px] sm:text-[16px] mb-2 border-2 border-primary/10 w-fit p-2 rounded-sm font-semibold'>
                    {/* {matchDate === "Invalid Date" ? "No date info" : matchDate} */}
                    {groupBy === "date"
                      ? divider === "null"
                        ? "Matches without date"
                        : getFormattedDate(divider, !isSmall)
                      : divider === "null"
                      ? "Matches without round"
                      : divider}
                  </p>
                  <div className='flex flex-wrap items-center justify-start gap-2'>
                    {list.map((match) => (
                      <Card key={match.id} className='w-full bg-primary/10'>
                        <CardHeader>
                          <CardTitle className='flex flex-col items-center justify-center gap-4'>
                            <div className='flex w-full justify-between'>
                              {match.group && (
                                <div>
                                  <Badge
                                    variant='secondary'
                                    className='hover:bg-secondary'
                                  >
                                    {match.group.name}
                                  </Badge>
                                </div>
                              )}
                              <div>
                                <Badge
                                  variant={
                                    match.round ? "secondary" : "destructive"
                                  }
                                  className='hover:bg-secondary'
                                >
                                  {match.round
                                    ? `${match.round}`
                                    : "No round info"}
                                </Badge>
                              </div>
                            </div>
                            <div className='flex items-center justify-between gap-4'>
                              <div className='flex flex-col md:flex-row gap-2 items-center'>
                                <p className='hidden xs:block text-[16px] xs:text-[18px] font-bold'>
                                  {match.homeTeam
                                    ? match.homeTeam?.name
                                    : match.homeTeamPlacehlder}
                                </p>
                                <p className='hidden max-xs:block text-[16px] font-bold'>
                                  {!match.homeTeam
                                    ? match.homeTeamPlacehlder
                                    : match.homeTeam.code
                                    ? match.homeTeam.code
                                    : match.homeTeam.name}
                                </p>
                                {match.homeTeam && match.homeTeam.flagUrl && (
                                  <Image
                                    src={match.homeTeam?.flagUrl}
                                    width={25}
                                    height={25}
                                    alt={`${match.homeTeam?.name} Flag`}
                                  />
                                )}
                              </div>
                              {match.homeGoals !== null && (
                                <span className='text-[18px] xs:text-[22px] font-bold ml-8'>
                                  {match.homeGoals}
                                </span>
                              )}{" "}
                              -{" "}
                              {match.awayGoals !== null && (
                                <span className='text-[18px] xs:text-[22px] font-bold mr-8'>
                                  {match.awayGoals}
                                </span>
                              )}
                              <div className='flex flex-col-reverse md:flex-row gap-2 items-center'>
                                {match.awayTeam && match.awayTeam.flagUrl && (
                                  <Image
                                    src={match.awayTeam?.flagUrl}
                                    width={25}
                                    height={25}
                                    alt={`${match.awayTeam?.name} Flag`}
                                  />
                                )}
                                <p className='hidden xs:block text-[16px] xs:text-[18px] font-bold'>
                                  {match.awayTeam
                                    ? match.awayTeam?.name
                                    : match.awayTeamPlacehlder}
                                </p>
                                <p className='hidden max-xs:block text-[16px] font-bold'>
                                  {!match.awayTeam
                                    ? match.awayTeamPlacehlder
                                    : match.awayTeam.code
                                    ? match.awayTeam.code
                                    : match.awayTeam.name}
                                </p>
                              </div>
                            </div>
                          </CardTitle>
                        </CardHeader>
                        {/* {match.date && ( */}
                        <CardContent className='flex justify-between'>
                          <Badge
                            variant={match.date ? "default" : "destructive"}
                            className='hover:bg-primary'
                          >
                            {match.date
                              ? getFormattedDate(
                                  match.date.toString(),
                                  !isSmall
                                )
                              : "No date info"}
                          </Badge>
                          <Badge
                            variant={match.date ? "default" : "destructive"}
                            className='hover:bg-primary'
                          >
                            {match.date
                              ? getFormattedTime(
                                  match.date.toString(),
                                  !isSmall
                                )
                              : "No time info"}
                          </Badge>
                        </CardContent>
                        {/* )} */}
                      </Card>
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
