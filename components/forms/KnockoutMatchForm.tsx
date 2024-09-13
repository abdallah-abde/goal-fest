"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { Eraser } from "lucide-react";

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
  // teams,
  tournaments,
}: {
  match?: MatchProps | null;
  // teams: Team[];
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

  const [tournamentEditionId, setTournamentEditionId] = useState<string | null>(
    match?.tournamentEditionId.toString() ||
      (tournamentsEditions &&
        tournamentsEditions.length > 0 &&
        tournamentsEditions[0].id.toString()) ||
      null
  );

  const [groupTeams, setGroupTeams] = useState<Team[] | null>(null);

  const [isTeamsLoading, setIsTeamsLoading] = useState(false);

  useEffect(() => {
    async function getEditions() {
      setIsLoading(true);

      if (tournamentId) {
        const res = await fetch("/api/tournaments-editions/" + tournamentId);
        const data = await res.json();

        setTournamentsEditions(data);

        if (data.length > 0 && !match)
          setTournamentEditionId(data[0].id.toString());
      }
      setIsLoading(false);
    }

    getEditions();
  }, [tournamentId]);

  useEffect(() => {
    async function getTeams() {
      setIsTeamsLoading(true);

      if (tournamentEditionId) {
        const res = await fetch("/api/editions-teams/" + tournamentEditionId);
        const data = await res.json();

        setGroupTeams(data.teams);
      }
      setIsTeamsLoading(false);
    }

    getTeams();
  }, [tournamentEditionId]);

  const [homeTeamValue, setHomeTeamValue] = useState<number | undefined>(
    match?.homeTeamId || undefined
  );
  const [homeTeamKey, setHomeTeamKey] = useState(+new Date());

  const [awayTeamValue, setAwayTeamValue] = useState<number | undefined>(
    match?.awayTeamId || undefined
  );
  const [awayTeamKey, setAwayTeamKey] = useState(+new Date());

  return (
    <>
      <PageHeader
        label={match ? "Edit Knockout Match" : "Add Knockout Match"}
      />
      <form action={action} className='form-styles'>
        {tournaments && tournaments.length > 0 ? (
          <FormField>
            <Label htmlFor='tournamentId'>Tournament</Label>
            <Select
              name='tournamentId'
              defaultValue={
                match?.tournamentEdition.tournamentId.toString() ||
                tournamentId ||
                tournaments[0].id.toString() ||
                undefined
              }
              onValueChange={(value) => setTournamentId(value)}
            >
              <SelectTrigger className='flex-1'>
                <SelectValue placeholder='Choose Tournament' />
              </SelectTrigger>
              <SelectContent>
                {tournaments.map(({ id, name }) => (
                  <SelectItem value={id.toString()} key={id}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        ) : (
          <FormFieldLoadingState
            isLoading={false}
            label=''
            notFoundText='There is no tournaments, add some!'
          />
        )}
        {tournamentsEditions && tournamentsEditions.length > 0 && !isLoading ? (
          <FormField>
            <Label htmlFor='tournamentEditionId'>Tournament Edition</Label>
            <Select
              name='tournamentEditionId'
              defaultValue={
                match?.tournamentEditionId.toString() ||
                tournamentEditionId ||
                tournamentsEditions[0].id.toString() ||
                undefined
              }
            >
              <SelectTrigger className='flex-1'>
                <SelectValue placeholder='Choose Tournament Edition' />
              </SelectTrigger>
              <SelectContent>
                {tournamentsEditions.map(({ id, tournament, year }) => (
                  <SelectItem value={id.toString()} key={id}>
                    {`${tournament.name} ${year.toString()}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormFieldError error={error?.tournamentEditionId} />
          </FormField>
        ) : (
          <FormFieldLoadingState
            isLoading={isLoading}
            label='Loading Editions...'
            notFoundText='There is no editions, add some!'
          />
        )}
        {groupTeams && groupTeams.length > 0 && !isTeamsLoading ? (
          <FormField>
            <Label htmlFor='homeTeamId'>Home Team</Label>
            <div>
              <div className='flex items-center gap-2'>
                <Select
                  name='homeTeamId'
                  key={homeTeamKey}
                  defaultValue={
                    (homeTeamValue && homeTeamValue.toString()) || undefined
                  }
                  // defaultValue={
                  //   (match?.homeTeamId && match?.homeTeamId.toString()) ||
                  //   teams[0].id.toString() ||
                  //   undefined
                  // }
                >
                  <SelectTrigger className='flex-1'>
                    <SelectValue placeholder='Choose Home Team' />
                  </SelectTrigger>
                  <SelectContent>
                    {groupTeams.map(({ id, name }) => (
                      <SelectItem value={id.toString()} key={id}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type='button'
                  className='bg-secondary/50 hover:bg-primary/50 transition duration-300'
                  variant='outline'
                  size='icon'
                  onClick={(e) => {
                    e.stopPropagation();
                    setHomeTeamValue(undefined);
                    setHomeTeamKey(+new Date());
                  }}
                >
                  <Eraser strokeWidth='1.5px' />
                </Button>
              </div>
              <FormFieldError error={error?.homeTeamId} />
            </div>
          </FormField>
        ) : (
          <FormFieldLoadingState
            isLoading={false}
            label=''
            notFoundText='There is no teams, add some!'
          />
        )}
        {groupTeams && groupTeams.length > 0 && !isTeamsLoading ? (
          <FormField>
            <Label htmlFor='awayTeamId'>Away Team</Label>
            <div>
              <div className='flex items-center gap-2'>
                <Select
                  name='awayTeamId'
                  key={awayTeamKey}
                  defaultValue={
                    (awayTeamValue && awayTeamValue.toString()) || undefined
                  }
                >
                  <SelectTrigger className='flex-1'>
                    <SelectValue placeholder='Choose Away Team' />
                  </SelectTrigger>
                  <SelectContent>
                    {groupTeams.map(({ id, name }) => (
                      <SelectItem value={id.toString()} key={id}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type='button'
                  className='bg-secondary/50 hover:bg-primary/50 transition duration-300'
                  variant='outline'
                  size='icon'
                  onClick={(e) => {
                    e.stopPropagation();
                    setAwayTeamValue(undefined);
                    setAwayTeamKey(+new Date());
                  }}
                >
                  <Eraser strokeWidth='1.5px' />
                </Button>
              </div>
              <FormFieldError error={error?.awayTeamId} />
            </div>
          </FormField>
        ) : (
          <FormFieldLoadingState
            isLoading={false}
            label=''
            notFoundText='There is no teams, add some!'
          />
        )}
        <FormField>
          <Label htmlFor='homeGoals'>Home Main Time Goals</Label>
          <Input
            type='text'
            id='homeGoals'
            name='homeGoals'
            defaultValue={
              match?.homeGoals !== null ? match?.homeGoals.toString() : ""
            }
          />
          <FormFieldError error={error?.homeGoals} />
        </FormField>
        <FormField>
          <Label htmlFor='awayGoals'>Away Main Time Goals</Label>
          <Input
            type='text'
            id='awayGoals'
            name='awayGoals'
            defaultValue={
              match?.awayGoals !== null ? match?.awayGoals.toString() : ""
            }
          />
          <FormFieldError error={error?.awayGoals} />
        </FormField>
        <FormField>
          <Label htmlFor='homeExtraTimeGoals'>Home Extra Time Goals</Label>
          <Input
            type='text'
            id='homeExtraTimeGoals'
            name='homeExtraTimeGoals'
            defaultValue={
              match?.homeExtraTimeGoals !== null
                ? match?.homeExtraTimeGoals.toString()
                : ""
            }
          />
          <FormFieldError error={error?.homeExtraTimeGoals} />
        </FormField>
        <FormField>
          <Label htmlFor='awayExtraTimeGoals'>Away Extra Time Goals</Label>
          <Input
            type='text'
            id='awayExtraTimeGoals'
            name='awayExtraTimeGoals'
            defaultValue={
              match?.awayExtraTimeGoals !== null
                ? match?.awayExtraTimeGoals.toString()
                : ""
            }
          />
          <FormFieldError error={error?.awayExtraTimeGoals} />
        </FormField>
        <FormField>
          <Label htmlFor='homePenaltyGoals'>Home Penalty</Label>
          <Input
            type='text'
            id='homePenaltyGoals'
            name='homePenaltyGoals'
            defaultValue={
              match?.homePenaltyGoals !== null
                ? match?.homePenaltyGoals.toString()
                : ""
            }
          />
          <FormFieldError error={error?.homePenaltyGoals} />
        </FormField>
        <FormField>
          <Label htmlFor='awayPenaltyGoals'>Away Penalty</Label>
          <Input
            type='text'
            id='awayPenaltyGoals'
            name='awayPenaltyGoals'
            defaultValue={
              match?.awayPenaltyGoals !== null
                ? match?.awayPenaltyGoals.toString()
                : ""
            }
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
