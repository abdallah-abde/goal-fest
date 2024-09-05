"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Group, Team, Tournament, TournamentEdition } from "@prisma/client";

import { useFormState } from "react-dom";
import { addTournamentGroup, updateTournamentGroup } from "@/actions/groups";

import PageHeader from "@/components/PageHeader";
import SubmitButton from "@/components/forms/SubmitButton";
import FormField from "@/components/forms/parts/FormField";
import FormFieldError from "@/components/forms/parts/FormFieldError";
import FormFieldLoadingState from "@/components/forms/parts/FormFieldLoadingState";

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
      <form action={action} className='form-styles'>
        <FormField>
          <Label htmlFor='tournamentId'>Tournament Name</Label>
          <div>
            <select
              name='tournamentId'
              id='tournamentId'
              className='form-select'
              onChange={(e) => setTournamentId(e.target.value)}
              defaultValue={
                group?.tournamentEdition.tournamentId.toString() ||
                tournamentId ||
                undefined
              }
            >
              {tournaments.map(({ id, name }) => (
                <option key={id} value={id} className='text-primary-foreground'>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </FormField>
        {tournamentsEditions && tournamentsEditions.length > 0 && !isLoading ? (
          <FormField>
            <Label htmlFor='tournamentEditionId'>Tournament Edition Name</Label>
            <div>
              <select
                name='tournamentEditionId'
                id='tournamentEditionId'
                className='form-select'
                defaultValue={
                  group?.tournamentEditionId.toString() || undefined
                }
              >
                {tournamentsEditions.map(({ id, tournament, year }) => (
                  <option key={id} value={id} className='form-select-option'>
                    {`${tournament.name} ${year.toString()}`}
                  </option>
                ))}
              </select>
              <FormFieldError error={error?.tournamentEditionId} />
            </div>
          </FormField>
        ) : (
          <FormFieldLoadingState
            isLoading={isLoading}
            label='Loading Editions...'
            notFoundText='There is no editions, add some!'
          />
        )}
        <FormField>
          <Label htmlFor='name'>Name</Label>
          <Input
            type='text'
            id='name'
            name='name'
            // required
            defaultValue={group?.name || ""}
          />
          <FormFieldError error={error?.name} />
        </FormField>
        <FormField>
          <Label htmlFor='teams'>Teams</Label>
          <Input type='hidden' id='teams' name='teams' value={hiddenTeams} />
          <MultipleSelector
            className='form-multiple-selector-styles'
            ref={teamsRef}
            defaultOptions={teams.map(({ id, name }) => {
              return {
                label: name,
                value: name,
                dbValue: id.toString(),
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
            emptyIndicator={<p className='empty-indicator'>no teams found.</p>}
            value={selectedTeams}
          />
          <FormFieldError error={error?.teams} />
        </FormField>
        <SubmitButton
          isDisabled={
            isLoading || !tournamentsEditions || tournamentsEditions.length < 1
          }
        />
      </form>
    </>
  );
}
