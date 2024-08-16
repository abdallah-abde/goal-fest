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
} from "@/actions/tournamentsKnockoutMatches";

import PageHeader from "@/components/PageHeader";
import SubmitButton from "@/components/forms/SubmitButton";

import { useEffect, useState } from "react";

import { getUTCDateValueForDateTimeInput } from "@/lib/getFormattedDate";

import { LoadingSpinner } from "@/components/LoadingComponents";

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
                match?.tournamentEdition.tournamentId.toString() ||
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
                  match?.tournamentEditionId.toString() || undefined
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
          <Label htmlFor='homeTeamId'>Home Team</Label>
          <div>
            <select
              name='homeTeamId'
              id='homeTeamId'
              className='p-2 rounded-md w-full bg-primary/50 placeholder:text-white text-white'
              defaultValue={match?.homeTeamId || undefined}
            >
              <option value='choose team'>Choose Team...</option>
              {teams.map((t) => (
                <option
                  key={t.id}
                  value={t.id}
                  className='text-primary-foreground'
                >
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          {error?.homeTeamId && (
            <div className='text-destructive'>{error?.homeTeamId}</div>
          )}
        </div>
        <div className='space-y-2'>
          <Label htmlFor='awayTeamId'>Away Team</Label>
          <select
            name='awayTeamId'
            id='awayTeamId'
            className='p-2 rounded-md w-full bg-primary/50 placeholder:text-white text-white'
            defaultValue={match?.awayTeamId || undefined}
          >
            <option value='choose team'>Choose Team...</option>
            {teams.map((t) => (
              <option
                key={t.id}
                value={t.id}
                className='text-primary-foreground'
              >
                {t.name}
              </option>
            ))}
          </select>
          {error?.awayTeamId && (
            <div className='text-destructive'>{error?.awayTeamId}</div>
          )}
        </div>
        <div className='space-y-2'>
          <Label htmlFor='homeGoals'>Home Main Time Goals</Label>
          <Input
            type='text'
            id='homeGoals'
            name='homeGoals'
            defaultValue={match?.homeGoals || ""}
            className='p-2 px-[10px] rounded-md w-full bg-primary/50 placeholder:text-white text-white focus-visible:ring-0'
          />
          {error?.homeGoals && (
            <div className='text-destructive font-bold'>{error?.homeGoals}</div>
          )}
        </div>
        <div className='space-y-2'>
          <Label htmlFor='awayGoals'>Away Main Time Goals</Label>
          <Input
            type='text'
            id='awayGoals'
            name='awayGoals'
            defaultValue={match?.awayGoals || ""}
            className='p-2 px-[10px] rounded-md w-full bg-primary/50 placeholder:text-white text-white focus-visible:ring-0'
          />
          {error?.awayGoals && (
            <div className='text-destructive font-bold'>{error?.awayGoals}</div>
          )}
        </div>
        <div className='space-y-2'>
          <Label htmlFor='homeExtraTimeGoals'>Home Extra Time Goals</Label>
          <Input
            type='text'
            id='homeExtraTimeGoals'
            name='homeExtraTimeGoals'
            defaultValue={match?.homeExtraTimeGoals || ""}
            className='p-2 px-[10px] rounded-md w-full bg-primary/50 placeholder:text-white text-white focus-visible:ring-0'
          />
          {error?.homeExtraTimeGoals && (
            <div className='text-destructive font-bold'>
              {error?.homeExtraTimeGoals}
            </div>
          )}
        </div>
        <div className='space-y-2'>
          <Label htmlFor='awayExtraTimeGoals'>Away Extra Time Goals</Label>
          <Input
            type='text'
            id='awayExtraTimeGoals'
            name='awayExtraTimeGoals'
            defaultValue={match?.awayExtraTimeGoals || ""}
            className='p-2 px-[10px] rounded-md w-full bg-primary/50 placeholder:text-white text-white focus-visible:ring-0'
          />
          {error?.awayExtraTimeGoals && (
            <div className='text-destructive font-bold'>
              {error?.awayExtraTimeGoals}
            </div>
          )}
        </div>
        <div className='space-y-2'>
          <Label htmlFor='homePenaltyGoals'>Home Penalty</Label>
          <Input
            type='text'
            id='homePenaltyGoals'
            name='homePenaltyGoals'
            defaultValue={match?.homePenaltyGoals || ""}
            className='p-2 px-[10px] rounded-md w-full bg-primary/50 placeholder:text-white text-white focus-visible:ring-0'
          />
          {error?.homePenaltyGoals && (
            <div className='text-destructive font-bold'>
              {error?.homePenaltyGoals}
            </div>
          )}
        </div>
        <div className='space-y-2'>
          <Label htmlFor='awayPenaltyGoals'>Away Penalty</Label>
          <Input
            type='text'
            id='awayPenaltyGoals'
            name='awayPenaltyGoals'
            defaultValue={match?.awayPenaltyGoals || ""}
            className='p-2 px-[10px] rounded-md w-full bg-primary/50 placeholder:text-white text-white focus-visible:ring-0'
          />
          {error?.awayPenaltyGoals && (
            <div className='text-destructive font-bold'>
              {error?.awayPenaltyGoals}
            </div>
          )}
        </div>
        <div className='space-y-2'>
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
            className='p-2 px-[10px] rounded-md w-full bg-primary/50 placeholder:text-white text-white focus-visible:ring-0'
          />
          {error?.date && (
            <div className='text-destructive font-bold'>{error?.date}</div>
          )}
        </div>
        <div className='space-y-2'>
          <Label htmlFor='round'>Round</Label>
          <Input
            type='text'
            id='round'
            name='round'
            defaultValue={match?.round || ""}
            className='p-2 px-[10px] rounded-md w-full bg-primary/50 placeholder:text-white text-white focus-visible:ring-0'
          />
          {error?.round && (
            <div className='text-destructive font-bold'>{error?.round}</div>
          )}
        </div>
        <div className='space-y-2'>
          <Label htmlFor='homeTeamPlacehlder'>Home Team Placehlder</Label>
          <Input
            type='text'
            id='homeTeamPlacehlder'
            name='homeTeamPlacehlder'
            defaultValue={
              match?.homeTeamPlacehlder ? match?.homeTeamPlacehlder : ""
            }
            className='p-2 px-[10px] rounded-md w-full bg-primary/50 placeholder:text-white text-white focus-visible:ring-0'
          />
          {error?.homeTeamPlacehlder && (
            <div className='text-destructive font-bold'>
              {error?.homeTeamPlacehlder}
            </div>
          )}
        </div>
        <div className='space-y-2'>
          <Label htmlFor='awayTeamPlacehlder'>Away Team Placehlder</Label>
          <Input
            type='text'
            id='awayTeamPlacehlder'
            name='awayTeamPlacehlder'
            defaultValue={
              match?.awayTeamPlacehlder ? match?.awayTeamPlacehlder : ""
            }
            className='p-2 px-[10px] rounded-md w-full bg-primary/50 placeholder:text-white text-white focus-visible:ring-0'
          />
          {error?.awayTeamPlacehlder && (
            <div className='text-destructive font-bold'>
              {error?.awayTeamPlacehlder}
            </div>
          )}
        </div>
        {/* <Input
        type='hidden'
        id='tournamentEditionId'
        name='tournamentEditionId'
        defaultValue={params.id}
      /> */}

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
