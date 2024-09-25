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
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import * as _ from "lodash";

import { Filter, GroupIcon, CalendarDays } from "lucide-react";

import NoDataFoundComponent from "@/components/NoDataFoundComponent";
import MatchCard from "@/components/lists/cards/matches/MatchCard";
import ListTitle from "@/components/lists/ListTitle";
import FormField from "@/components/forms/parts/FormField";
import PageHeader from "@/components/PageHeader";

import { NeutralMatch } from "@/types";

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
  tournamentEdition: TournamentEditionProps | null;
  matches: MatchProps[];
  knockoutMatches: KnockoutMatchProps[];
  rounds: string[];
}) {
  const searchParams = useSearchParams();

  const params = new URLSearchParams(searchParams);

  const { replace } = useRouter();
  const pathname = usePathname();

  const allMatches: NeutralMatch[] = switchGroupMatchesToNeutralMatches(
    matches
  ).concat(switchKnockoutMatchesToNeutralMatches(knockoutMatches));

  const [groupBy, setGroupBy] = useState("onlyDate");
  const results = Object.entries(_.groupBy(allMatches, groupBy));

  return (
    <>
      <PageHeader
        label={`${tournamentEdition?.tournament.name} ${tournamentEdition?.yearAsString} Matches`}
      />
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
              {groupBy === "stage" ? (
                <>
                  <CalendarDays /> Group by Date
                </>
              ) : (
                <>
                  <GroupIcon /> Group by Stage
                </>
              )}
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant='outline'
                  className='flex gap-2 border-2 border-secondary hover:border-primary/10'
                >
                  <Filter /> Filter
                </Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                  <DialogTitle>Options</DialogTitle>
                </DialogHeader>
                <div className='form-styles py-4'>
                  <FormField>
                    <Label htmlFor='teamId'>Teams</Label>
                    <Select
                      name='teamId'
                      value={
                        (!isNaN(Number(params.get("teamId")))
                          ? params.get("teamId")
                          : "all") || "all"
                      }
                      onValueChange={(value) => {
                        params.set("teamId", value);
                        replace(`${pathname}?${params.toString()}`);
                      }}
                    >
                      <SelectTrigger className='flex-1'>
                        <SelectValue placeholder='Choose Team' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Teams</SelectItem>
                        {tournamentEdition?.teams.map((team) => (
                          <SelectItem key={team.id} value={team.id.toString()}>
                            {team.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                  <FormField>
                    <Label htmlFor='groupId'>Groups</Label>
                    <Select
                      name='groupId'
                      value={
                        (!isNaN(Number(params.get("groupId")))
                          ? params.get("groupId")
                          : "all") || "all"
                      }
                      onValueChange={(value) => {
                        params.set("groupId", value);
                        replace(`${pathname}?${params.toString()}`);
                      }}
                    >
                      <SelectTrigger className='flex-1'>
                        <SelectValue placeholder='Choose Group' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Groups</SelectItem>
                        {tournamentEdition?.groups.map((group) => (
                          <SelectItem
                            key={group.id}
                            value={group.id.toString()}
                          >
                            {group.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                  <FormField>
                    <Label htmlFor='round'>Round</Label>
                    <Select
                      name='round'
                      value={params.get("round") || "all"}
                      onValueChange={(value) => {
                        params.set("round", value);
                        replace(`${pathname}?${params.toString()}`);
                      }}
                    >
                      <SelectTrigger className='flex-1'>
                        <SelectValue placeholder='Choose Round' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Rounds</SelectItem>
                        {rounds.map((round) => (
                          <SelectItem key={round} value={round}>
                            {round}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                  {/* <div className='col-span-2'>
              <Button type='submit'>Filter</Button>
            </div> */}
                </div>
              </DialogContent>
            </Dialog>
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
