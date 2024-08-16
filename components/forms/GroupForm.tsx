"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Group, Team, Tournament, TournamentEdition } from "@prisma/client";

import { useFormState } from "react-dom";
import {
  addTournamentGroup,
  updateTournamentGroup,
} from "@/actions/tournamentsGroups";

import PageHeader from "@/components/PageHeader";
import SubmitButton from "@/components/forms/SubmitButton";

import { useEffect, useRef, useState } from "react";

import MultipleSelector, {
  MultipleSelectorRef,
} from "@/components/ui/multiple-selector";

import { LoadingSpinner } from "@/components/LoadingComponents";

interface GroupProps extends Group {
  tournamentEdition: TournamentEditionProps;
  teams: Team[];
}

interface TournamentEditionProps extends TournamentEdition {
  tournament: Tournament;
}

export default function GroupForm({
  group,
  teams,
  tournaments,
}: {
  group?: GroupProps | null;
  teams: Team[];
  tournaments: Tournament[];
}) {
  const [error, action] = useFormState(
    group == null
      ? addTournamentGroup
      : updateTournamentGroup.bind(null, group.id),
    {}
  );

  const [tournamentId, setTournamentId] = useState<string | null>(
    group?.tournamentEdition.tournamentId.toString() ||
      (tournaments && tournaments.length > 0 && tournaments[0].id.toString()) ||
      null
  );

  const [isLoading, setIsLoading] = useState(false);

  const [tournamentsEditions, setTournamentsEditions] = useState<
    TournamentEditionProps[] | null
  >(null);

  useEffect(() => {
    async function getEditions() {
      setIsLoading(true);

      // await new Promise((resolve) => {
      //   setTimeout(() => {}, 3000);
      // });

      if (tournamentId) {
        const res = await fetch("/api/tournaments-editions/" + tournamentId);
        const data = await res.json();

        setTournamentsEditions(data);
      }
      setIsLoading(false);
    }

    getEditions();
  }, [tournamentId]);

  const teamsRef = useRef<MultipleSelectorRef>(null);
  const [hiddenTeams, setHiddenTeams] = useState<string>(
    (group &&
      group.teams.length > 0 &&
      group.teams
        .map((a) => {
          return a.id.toString();
        })
        .join(",")) ||
      ""
  );

  const [selectedTeams, setSelectedTeams] = useState(
    (group &&
      group.teams.length > 0 &&
      group.teams.map((a) => {
        return {
          label: a.name,
          value: a.name,
          dbValue: a.id.toString(),
        };
      })) ||
      undefined
  );

  return (
    <>
      <PageHeader label={group ? "Edit Group" : "Add Group"} />
      <form
        action={action}
        className='space-y-8 lg:space-y-0 lg:grid grid-cols-2 gap-4'
      >
        <div className='space-y-2'>
          <Label htmlFor='tournamentId'>Tournament Name</Label>
          <div>
            <select
              name='tournamentId'
              id='tournamentId'
              className='p-2 rounded-md w-full bg-primary/50 placeholder:text-white text-white'
              onChange={(e) => setTournamentId(e.target.value)}
              defaultValue={
                group?.tournamentEdition.tournamentId.toString() ||
                tournamentId ||
                undefined
              }
            >
              {tournaments.map((tor) => (
                <option
                  key={tor.id}
                  value={tor.id}
                  className='text-primary-foreground'
                >
                  {tor.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        {tournamentsEditions && tournamentsEditions.length > 0 && !isLoading ? (
          <div className='space-y-2'>
            <Label htmlFor='tournamentEditionId'>Tournament Edition Name</Label>
            <div>
              <select
                name='tournamentEditionId'
                id='tournamentEditionId'
                className='p-2 rounded-md w-full bg-primary/50 placeholder:text-white text-white'
                defaultValue={
                  group?.tournamentEditionId.toString() || undefined
                }
              >
                {tournamentsEditions.map((edi) => (
                  <option
                    key={edi.id}
                    value={edi.id}
                    className='text-primary-foreground'
                  >
                    {`${edi.tournament.name} ${edi.year.toString()}`}
                  </option>
                ))}
              </select>
            </div>
            {error.tournamentEditionId && (
              <div className='text-destructive'>
                {error.tournamentEditionId}
              </div>
            )}
          </div>
        ) : (
          <div className='space-y-2 flex items-center justify-center gap-2'>
            {isLoading && (
              <>
                <p>Loading Editions...</p>
                <LoadingSpinner />
              </>
            )}
          </div>
        )}
        <div className='space-y-2'>
          <Label htmlFor='name'>Name</Label>
          <Input
            type='text'
            id='name'
            name='name'
            required
            defaultValue={group?.name || ""}
            className='p-2 px-[10px] rounded-md w-full bg-primary/50 placeholder:text-white text-white focus-visible:ring-0'
          />
          {error?.name && (
            <div className='text-destructive font-bold'>{error?.name}</div>
          )}
        </div>
        <div className='space-y-2'>
          <Label htmlFor='teams'>Teams</Label>
          <Input type='hidden' id='teams' name='teams' value={hiddenTeams} />
          <MultipleSelector
            className='dark:border-1 dark:border-primary focus-visible:ring-0 outline-0'
            ref={teamsRef}
            defaultOptions={teams.map((t) => {
              return {
                label: t.name,
                value: t.name,
                dbValue: t.id.toString(),
              };
            })}
            onChange={(options) => {
              setHiddenTeams(
                options
                  .map((a) => {
                    return a.dbValue;
                  })
                  .join(",")
              );
            }}
            placeholder='Select teams you like to add to the group'
            emptyIndicator={
              <p className='text-center text-lg leading-10 text-gray-600 dark:text-gray-400'>
                no teams found.
              </p>
            }
            value={selectedTeams}
          />
          {error?.teams && (
            <div className='text-destructive'>{error?.teams}</div>
          )}
        </div>
        <div className='col-span-2'>
          <SubmitButton
            isDisabled={
              isLoading ||
              !tournamentsEditions ||
              tournamentsEditions.length < 1
            }
          />
        </div>
      </form>
    </>
  );
}
