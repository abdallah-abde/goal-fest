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
      onlyDate: match.date ? match.date.toLocaleDateString() : "",
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
      onlyDate: match.date ? match.date.toLocaleDateString() : "",
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
            {results.map(([divider, list], _) => {
              return (
                <div key={_} className='w-full'>
                  <p className='text-[14px] sm:text-[16px] mb-2 border-2 border-primary/10 w-fit p-2 rounded-sm font-semibold'>
                    {/* {matchDate === "Invalid Date" ? "No date info" : matchDate} */}
                    {groupBy === "onlyDate"
                      ? divider === ""
                        ? "Matches without date"
                        : getFormattedDate(divider, !isSmall)
                      : divider === "null"
                      ? "Matches without round"
                      : divider}
                  </p>
                  <div className='w-full space-y-2'>
                    {list.map((match) => (
                      <Card key={match.id} className='rounded-lg bg-primary/10'>
                        <CardContent className='grid grid-cols-5 grid-rows-3 gap-2 pt-6'>
                          {/* <CardHeader> */}
                          {/* <CardTitle className='flex flex-col items-center justify-center gap-4'> */}
                          {/* <div> */}
                          {match.group && (
                            <div className='row-start-1 col-start-1 col-end-3 self-center'>
                              <Badge
                                variant='secondary'
                                className='hover:bg-secondary'
                              >
                                {match.group.name}
                              </Badge>
                            </div>
                          )}
                          <div
                            className={`row-start-1 col-start-${
                              match.group ? "4" : "1"
                            } col-end-${
                              match.group ? "6" : "3"
                            } self-center place-self-${
                              match.group ? "end" : "start"
                            }`}
                          >
                            <Badge
                              variant={
                                match.round ? "secondary" : "destructive"
                              }
                              className='hover:bg-secondary'
                            >
                              {match.round ? `${match.round}` : "No round info"}
                            </Badge>
                          </div>
                          {/* </div> */}
                          {/* <div className='w-full flex items-center gap-4'> */}
                          <div className='row-start-2 col-start-1 col-end-3 place-self-end self-center flex flex-col md:flex-row items-center gap-3  max-xs:gap-2'>
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
                          <div className='row-start-1 row-end-4 col-start-3 col-end-4 place-self-center flex flex-col items-center justify-center gap-2'>
                            {match.homeGoals !== null &&
                              match.awayGoals !== null && (
                                <div className='text-[18px] xs:text-[22px] font-bold flex gap-2'>
                                  {match.homeGoals !== null && (
                                    <span className='ml-auto'>
                                      {match.homeGoals}
                                    </span>
                                  )}
                                  <span className='text-center'>-</span>
                                  {match.awayGoals !== null && (
                                    <span className='mr-auto'>
                                      {match.awayGoals}
                                    </span>
                                  )}
                                </div>
                              )}
                            {match.homeExtraTimeGoals !== null &&
                              match.awayExtraTimeGoals !== null && (
                                <div className='text-[10px] xs:text-[14px] font-bold flex flex-col items-center justify-center'>
                                  <span>Extra time:</span>
                                  <div className='flex gap-2'>
                                    {match.homeExtraTimeGoals !== null && (
                                      <span className='ml-auto'>
                                        {match.homeExtraTimeGoals}
                                      </span>
                                    )}
                                    <span className='text-center'>-</span>
                                    {match.awayExtraTimeGoals !== null && (
                                      <span className='mr-auto'>
                                        {match.awayExtraTimeGoals}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            {match.homePenaltyGoals !== null &&
                              match.awayPenaltyGoals !== null && (
                                <div className='text-[10px] xs:text-[14px] font-bold flex flex-col items-center justify-center'>
                                  <span>Penalties:</span>
                                  <div className='flex gap-2'>
                                    {match.homePenaltyGoals !== null && (
                                      <span className='ml-auto'>
                                        {match.homePenaltyGoals}
                                      </span>
                                    )}
                                    <span className='text-center'>-</span>
                                    {match.awayPenaltyGoals !== null && (
                                      <span className='mr-auto'>
                                        {match.awayPenaltyGoals}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                          </div>
                          <div className='row-start-2 col-start-4 col-end-6 place-self-start self-center flex flex-col-reverse md:flex-row items-center gap-3 max-xs:gap-2'>
                            {/* flex-1 flex flex-col-reverse md:flex-row gap-3  max-xs:gap-2 items-center */}
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
                          {/* </div> */}
                          {/* </CardTitle> */}
                          {/* </CardHeader> */}
                          {/* {match.date && ( */}
                          {/* <div> */}
                          <div className='row-start-3 col-start-1 col-end-3 self-center'>
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
                          </div>
                          <div className='row-start-3 col-start-4 col-end-6 self-center place-self-end'>
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
                          </div>
                          {/* </div> */}
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
