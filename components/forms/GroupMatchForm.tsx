"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Match,
  Team,
  Tournament,
  TournamentEdition,
  Group,
} from "@prisma/client";

import { useFormState } from "react-dom";
import {
  addTournamentGroupMatch,
  updateTournamentGroupMatch,
} from "@/actions/groupMatches";

import PageHeader from "@/components/PageHeader";
import SubmitButton from "@/components/forms/parts/SubmitButton";
import FormField from "@/components/forms/parts/FormField";
import FormFieldError from "@/components/forms/parts/FormFieldError";
import FormFieldLoadingState from "@/components/forms/parts/FormFieldLoadingState";

import { useEffect, useState } from "react";

import { getUTCDateValueForDateTimeInput } from "@/lib/getFormattedDate";

interface MatchProps extends Match {
  tournamentEdition: TournamentEditionProps;
}

interface TournamentEditionProps extends TournamentEdition {
  tournament: Tournament;
}

export default function GroupMatchForm({
  match,
  teams,
  tournaments,
}: {
  match?: MatchProps | null;
  teams: Team[];
  tournaments: Tournament[];
}) {
  const [error, action] = useFormState(
    match == null
      ? addTournamentGroupMatch
      : updateTournamentGroupMatch.bind(null, match.id),
    {}
  );

  const [tournamentId, setTournamentId] = useState<string | null>(
    match?.tournamentEdition.tournamentId.toString() ||
      (tournaments && tournaments.length > 0 && tournaments[0].id.toString()) ||
      null
  );

  const [isEditionsLoading, setIsEditionsLoading] = useState(false);

  const [tournamentsEditions, setTournamentsEditions] = useState<
    TournamentEditionProps[] | null
  >(null);

  const [tournamentEditionId, setTournamentEditionId] = useState<string | null>(
    match?.tournamentEditionId.toString() ||
      (tournamentsEditions &&
        tournamentsEditions.length > 0 &&
        tournamentsEditions[0].id.toString()) ||
      null
  );

  const [groups, setGroups] = useState<Group[] | null>(null);

  const [isGroupsLoading, setIsGroupsLoading] = useState(false);

  useEffect(() => {
    async function getEditions() {
      setIsEditionsLoading(true);
      if (tournamentId) {
        const res = await fetch("/api/tournaments-editions/" + tournamentId);
        const data: TournamentEditionProps[] = await res.json();

        setTournamentsEditions(data);
        if (data.length > 0) setTournamentEditionId(data[0].id.toString());
      }
      setIsEditionsLoading(false);
    }

    getEditions();
  }, [tournamentId]);

  useEffect(() => {
    async function getGroups() {
      setIsGroupsLoading(true);
      if (tournamentEditionId) {
        const res = await fetch("/api/groups/" + tournamentEditionId);
        const data = await res.json();

        setGroups(data);
      }
      setIsGroupsLoading(false);
    }

    getGroups();
  }, [tournamentEditionId]);

  return (
    <>
      <PageHeader label={match ? "Edit Group Match" : "Add Group Match"} />
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
                match?.tournamentEdition.tournamentId.toString() ||
                tournamentId ||
                undefined
              }
            >
              {tournaments.map(({ id, name }) => (
                <option key={id} value={id} className='form-select-option'>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </FormField>
        {tournamentsEditions &&
        tournamentsEditions.length > 0 &&
        !isEditionsLoading ? (
          <FormField>
            <Label htmlFor='tournamentEditionId'>Tournament Edition Name</Label>
            <div>
              <select
                name='tournamentEditionId'
                id='tournamentEditionId'
                className='form-select'
                onChange={(e) => setTournamentEditionId(e.target.value)}
                defaultValue={
                  match?.tournamentEditionId.toString() ||
                  tournamentEditionId ||
                  undefined
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
            isLoading={isEditionsLoading}
            label='Loading Editions...'
            notFoundText='There is no editions, add some!'
          />
        )}
        {groups && groups.length > 0 && !isGroupsLoading ? (
          <FormField>
            <Label htmlFor='groupId'>Group</Label>
            <div>
              <select
                name='groupId'
                id='groupId'
                className='form-select'
                defaultValue={match?.groupId.toString() || undefined}
              >
                {groups.map(({ id, name }) => (
                  <option key={id} value={id} className='form-select-option'>
                    {name}
                  </option>
                ))}
              </select>
              <FormFieldError error={error?.groupId} />
            </div>
          </FormField>
        ) : (
          <FormFieldLoadingState
            isLoading={isGroupsLoading}
            label='Loading Groups...'
            notFoundText='There is no groups, add some!'
          />
        )}
        <FormField>
          <Label htmlFor='homeTeamId'>Home Team</Label>
          <div>
            <select
              name='homeTeamId'
              id='homeTeamId'
              className='form-select'
              defaultValue={match?.homeTeamId || undefined}
            >
              <option className='form-select-option' value='choose team'>
                Choose Team...
              </option>
              {teams.map(({ id, name }) => (
                <option key={id} value={id} className='form-select-option'>
                  {name}
                </option>
              ))}
            </select>
            <FormFieldError error={error?.homeTeamId} />
          </div>
        </FormField>
        <FormField>
          <Label htmlFor='awayTeamId'>Away Team</Label>
          <div>
            <select
              name='awayTeamId'
              id='awayTeamId'
              className='form-select'
              defaultValue={match?.awayTeamId || undefined}
            >
              <option className='form-select-option' value='choose team'>
                Choose Team...
              </option>
              {teams.map(({ id, name }) => (
                <option key={id} value={id} className='form-select-option'>
                  {name}
                </option>
              ))}
            </select>
            <FormFieldError error={error?.awayTeamId} />
          </div>
        </FormField>
        <FormField>
          <Label htmlFor='homeGoals'>Home Goals</Label>
          <Input
            type='text'
            id='homeGoals'
            name='homeGoals'
            defaultValue={match?.homeGoals || ""}
          />
          <FormFieldError error={error?.homeGoals} />
        </FormField>
        <FormField>
          <Label htmlFor='awayGoals'>Away Goals</Label>
          <Input
            type='text'
            id='awayGoals'
            name='awayGoals'
            defaultValue={match?.awayGoals || ""}
          />
          <FormFieldError error={error?.awayGoals} />
        </FormField>
        <FormField>
          <Label htmlFor='date'>Date</Label>
          <Input
            type='datetime-local'
            id='date'
            name='date'
            defaultValue={
              match?.date
                ? getUTCDateValueForDateTimeInput(match?.date)
                : undefined
            }
          />
          <FormFieldError error={error?.date} />
        </FormField>
        <FormField>
          <Label htmlFor='round'>Round</Label>
          <Input
            type='text'
            id='round'
            name='round'
            defaultValue={match?.round || ""}
          />
          <FormFieldError error={error?.round} />
        </FormField>

        <SubmitButton
          isDisabled={
            isEditionsLoading ||
            !tournamentsEditions ||
            tournamentsEditions.length < 1 ||
            isGroupsLoading ||
            !groups ||
            groups.length < 1
          }
        />
      </form>
    </>
  );
}
