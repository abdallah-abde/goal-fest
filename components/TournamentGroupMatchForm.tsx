"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormState, useFormStatus } from "react-dom";
import {
  addTournamentGroupMatch,
  updateTournamentGroupMatch,
} from "@/actions/tournamentsGroupMatches";
import { Match, Team } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { getUTCDateValueForDateTimeInput } from "@/lib/getFormattedDate";

export default function TournamentGroupMatchForm({
  match,
  teams,
}: {
  match?: Match | null;
  teams: Team[];
}) {
  const params = useParams();
  const [error, action] = useFormState(
    !match
      ? addTournamentGroupMatch
      : updateTournamentGroupMatch.bind(null, match.id),
    {}
  );

  return (
    <form action={action} className='space-y-8'>
      <div className='space-y-2'>
        <Label htmlFor='homeTeamId'>Home Team</Label>
        <select
          name='homeTeamId'
          id='homeTeamId'
          defaultValue={match?.homeTeamId}
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
          defaultValue={match?.awayTeamId}
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
        <Label htmlFor='homeGoals'>Home Goals</Label>
        <Input
          type='text'
          id='homeGoals'
          name='homeGoals'
          defaultValue={match?.homeGoals || ""}
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='awayGoals'>Away Goals</Label>
        <Input
          type='text'
          id='awayGoals'
          name='awayGoals'
          defaultValue={match?.awayGoals || ""}
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='date'>Date</Label>
        <Input
          type='datetime-local'
          id='date'
          name='date'
          defaultValue={
            match?.date && getUTCDateValueForDateTimeInput(match?.date)
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
      <Input
        type='hidden'
        id='tournamentEditionId'
        name='tournamentEditionId'
        defaultValue={params.id}
      />
      <Input
        type='hidden'
        id='groupId'
        name='groupId'
        defaultValue={params.groupId}
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
