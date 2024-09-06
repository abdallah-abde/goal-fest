"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  KnockoutMatch,
  Team,
  Tournament,
  TournamentEdition,
} from "@prisma/client";

import { useFormState } from "react-dom";
import {
  addTournamentKnockoutMatch,
  updateTournamentKnockoutMatch,
} from "@/actions/knockoutMatches";

import PageHeader from "@/components/PageHeader";
import SubmitButton from "@/components/forms/parts/SubmitButton";
import FormField from "@/components/forms/parts/FormField";
import FormFieldError from "@/components/forms/parts/FormFieldError";
import FormFieldLoadingState from "@/components/forms/parts/FormFieldLoadingState";

import { useEffect, useState } from "react";

import { getUTCDateValueForDateTimeInput } from "@/lib/getFormattedDate";

interface MatchProps extends KnockoutMatch {
  tournamentEdition: TournamentEditionProps;
}

interface TournamentEditionProps extends TournamentEdition {
  tournament: Tournament;
}

export default function KnockoutMatchForm({
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
      ? addTournamentKnockoutMatch
      : updateTournamentKnockoutMatch.bind(null, match.id),
    {}
  );

  const [tournamentId, setTournamentId] = useState<string | null>(
    match?.tournamentEdition.tournamentId.toString() ||
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

  return (
    <>
      <PageHeader
        label={match ? "Edit Knockout Match" : "Add Knockout Match"}
      />
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
        {tournamentsEditions && tournamentsEditions.length > 0 && !isLoading ? (
          <FormField>
            <Label htmlFor='tournamentEditionId'>Tournament Edition Name</Label>
            <div>
              <select
                name='tournamentEditionId'
                id='tournamentEditionId'
                className='form-select'
                defaultValue={
                  match?.tournamentEditionId.toString() || undefined
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
          </div>
          <FormFieldError error={error?.awayTeamId} />
        </FormField>
        <FormField>
          <Label htmlFor='homeGoals'>Home Main Time Goals</Label>
          <Input
            type='text'
            id='homeGoals'
            name='homeGoals'
            defaultValue={match?.homeGoals || ""}
          />
          <FormFieldError error={error?.homeGoals} />
        </FormField>
        <FormField>
          <Label htmlFor='awayGoals'>Away Main Time Goals</Label>
          <Input
            type='text'
            id='awayGoals'
            name='awayGoals'
            defaultValue={match?.awayGoals || ""}
          />
          <FormFieldError error={error?.awayGoals} />
        </FormField>
        <FormField>
          <Label htmlFor='homeExtraTimeGoals'>Home Extra Time Goals</Label>
          <Input
            type='text'
            id='homeExtraTimeGoals'
            name='homeExtraTimeGoals'
            defaultValue={match?.homeExtraTimeGoals || ""}
          />
          <FormFieldError error={error?.homeExtraTimeGoals} />
        </FormField>
        <FormField>
          <Label htmlFor='awayExtraTimeGoals'>Away Extra Time Goals</Label>
          <Input
            type='text'
            id='awayExtraTimeGoals'
            name='awayExtraTimeGoals'
            defaultValue={match?.awayExtraTimeGoals || ""}
          />
          <FormFieldError error={error?.awayExtraTimeGoals} />
        </FormField>
        <FormField>
          <Label htmlFor='homePenaltyGoals'>Home Penalty</Label>
          <Input
            type='text'
            id='homePenaltyGoals'
            name='homePenaltyGoals'
            defaultValue={match?.homePenaltyGoals || ""}
          />
          <FormFieldError error={error?.homePenaltyGoals} />
        </FormField>
        <FormField>
          <Label htmlFor='awayPenaltyGoals'>Away Penalty</Label>
          <Input
            type='text'
            id='awayPenaltyGoals'
            name='awayPenaltyGoals'
            defaultValue={match?.awayPenaltyGoals || ""}
          />
          <FormFieldError error={error?.awayPenaltyGoals} />
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
        <FormField>
          <Label htmlFor='homeTeamPlacehlder'>Home Team Placehlder</Label>
          <Input
            type='text'
            id='homeTeamPlacehlder'
            name='homeTeamPlacehlder'
            defaultValue={
              match?.homeTeamPlacehlder ? match?.homeTeamPlacehlder : ""
            }
          />
          <FormFieldError error={error?.homeTeamPlacehlder} />
        </FormField>
        <FormField>
          <Label htmlFor='awayTeamPlacehlder'>Away Team Placehlder</Label>
          <Input
            type='text'
            id='awayTeamPlacehlder'
            name='awayTeamPlacehlder'
            defaultValue={
              match?.awayTeamPlacehlder ? match?.awayTeamPlacehlder : ""
            }
          />
          <FormFieldError error={error?.awayTeamPlacehlder} />
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
