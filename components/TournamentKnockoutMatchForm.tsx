"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormState, useFormStatus } from "react-dom";
import {
  addTournamentKnockoutMatch,
  updateTournamentKnockoutMatch,
} from "@/actions/tournamentsKnockoutMatches";
import { KnockoutMatch, Team } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { getUTCDateValueForDateTimeInput } from "@/lib/getFormattedDate";

export default function TournamentKnockoutMatchForm({
  match,
  teams,
}: {
  match?: KnockoutMatch | null;
  teams: Team[];
}) {
  const params = useParams();
  const [error, action] = useFormState(
    !match
      ? addTournamentKnockoutMatch
      : updateTournamentKnockoutMatch.bind(null, match.id),
    {}
  );

  return (
    <form action={action} className='space-y-8 mb-24'>
      <div className='space-y-2'>
        <Label htmlFor='homeTeamId'>Home Team</Label>
        <select
          name='homeTeamId'
          id='homeTeamId'
          defaultValue={match?.homeTeamId ? match?.homeTeamId : undefined}
        >
          <option value='choose team'>Choose Team...</option>
          {teams.map((t) => (
            <option
              key={t.id}
              value={t.id}
              // selected={match?.homeTeamId ? t.id === match.homeTeamId : false}
            >
              {t.name}
            </option>
          ))}
        </select>
        {/* {error?.message && <div className='text-destructive'>{error?.message}</div>} */}
      </div>
      <div className='space-y-2'>
        <Label htmlFor='awayTeamId'>Away Team</Label>
        <select
          name='awayTeamId'
          id='awayTeamId'
          defaultValue={match?.awayTeamId ? match?.awayTeamId : undefined}
        >
          <option value='choose team'>Choose Team...</option>
          {teams.map((t) => (
            <option
              key={t.id}
              value={t.id}
              // selected={match?.awayTeamId ? t.id === match.awayTeamId : false}
            >
              {t.name}
            </option>
          ))}
        </select>
        {/* {error?.message && <div className='text-destructive'>{error?.message}</div>} */}
      </div>
      <div className='space-y-2'>
        <Label htmlFor='homeGoals'>Home Main Time Goals</Label>
        <Input
          type='text'
          id='homeGoals'
          name='homeGoals'
          defaultValue={match?.homeGoals || ""}
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='awayGoals'>Away Main Time Goals</Label>
        <Input
          type='text'
          id='awayGoals'
          name='awayGoals'
          defaultValue={match?.awayGoals || ""}
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='homeExtraTimeGoals'>Home Extra Time Goals</Label>
        <Input
          type='text'
          id='homeExtraTimeGoals'
          name='homeExtraTimeGoals'
          defaultValue={match?.homeExtraTimeGoals || ""}
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='awayExtraTimeGoals'>Away Extra Time Goals</Label>
        <Input
          type='text'
          id='awayExtraTimeGoals'
          name='awayExtraTimeGoals'
          defaultValue={match?.awayExtraTimeGoals || ""}
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='homePenaltyGoals'>Home Penalty</Label>
        <Input
          type='text'
          id='homePenaltyGoals'
          name='homePenaltyGoals'
          defaultValue={match?.homePenaltyGoals || ""}
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='awayPenaltyGoals'>Away Penalty</Label>
        <Input
          type='text'
          id='awayPenaltyGoals'
          name='awayPenaltyGoals'
          defaultValue={match?.awayPenaltyGoals || ""}
        />
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
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='round'>Round</Label>
        <Input
          type='text'
          id='round'
          name='round'
          defaultValue={match?.round ? match?.round : ""}
        />
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
        />
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
        />
      </div>
      <Input
        type='hidden'
        id='tournamentEditionId'
        name='tournamentEditionId'
        defaultValue={params.id}
      />

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
