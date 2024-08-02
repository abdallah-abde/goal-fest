"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useFormState, useFormStatus } from "react-dom";
import {
  addTournamentGroup,
  updateTournamentGroup,
} from "@/actions/tournamentsGroups";

import { Group, Team, Tournament, TournamentEdition } from "@prisma/client";
import { useEffect, useRef, useState } from "react";

import MultipleSelector, {
  MultipleSelectorRef,
} from "@/components/ui/multiple-selector";

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
    !group ? addTournamentGroup : updateTournamentGroup.bind(null, group.id),
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
    <form action={action} className='space-y-8'>
      <div className='space-y-2 flex flex-col gap-1'>
        <Label htmlFor='tournamentId'>Tournament Name</Label>
        <select
          name='tournamentId'
          id='tournamentId'
          className='p-2 rounded-md'
          onChange={(e) => setTournamentId(e.target.value)}
          defaultValue={
            group?.tournamentEdition.tournamentId.toString() ||
            tournamentId ||
            undefined
          }
        >
          {tournaments.map((tor) => (
            <option key={tor.id} value={tor.id}>
              {tor.name}
            </option>
          ))}
        </select>
      </div>
      {tournamentsEditions && tournamentsEditions.length > 0 && !isLoading ? (
        <div className='space-y-2 flex flex-col gap-1'>
          <Label htmlFor='tournamentEditionId'>Tournament Edition Name</Label>
          <select
            name='tournamentEditionId'
            id='tournamentEditionId'
            className='p-2 rounded-md'
            defaultValue={group?.tournamentEditionId.toString() || undefined}
          >
            {tournamentsEditions.map((edi) => (
              <option key={edi.id} value={edi.id}>
                {`${edi.tournament.name} ${edi.year.toString()}`}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <>{isLoading && <p>Loading...</p>}</>
      )}
      <div className='space-y-2'>
        <Label htmlFor='name'>Name</Label>
        <Input
          type='text'
          id='name'
          name='name'
          required
          defaultValue={group?.name || ""}
        />
        {/* {error?.message && <div className='text-destructive'>{error?.message}</div>} */}
      </div>
      <div className='space-y-2 flex flex-col gap-1'>
        <Label htmlFor='teams'>Teams</Label>
        <Input type='hidden' id='teams' name='teams' value={hiddenTeams} />
        <MultipleSelector
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
        {/* {error?.message && <div className='text-destructive'>{error?.message}</div>} */}
      </div>
      {/* <pre>{JSON.stringify(hiddenTeams)}</pre> */}
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type='submit' disabled={pending}>
      {pending ? "Saving..." : "Save"}
    </Button>
  );
}
