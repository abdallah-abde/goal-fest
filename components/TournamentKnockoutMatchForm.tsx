"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormState, useFormStatus } from "react-dom";
import {
  addTournamentKnockoutMatch,
  updateTournamentKnockoutMatch,
} from "@/actions/tournamentsKnockoutMatches";
import {
  KnockoutMatch,
  Team,
  Tournament,
  TournamentEdition,
} from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getUTCDateValueForDateTimeInput } from "@/lib/getFormattedDate";

interface MatchProps extends KnockoutMatch {
  tournamentEdition: TournamentEditionProps;
}

interface TournamentEditionProps extends TournamentEdition {
  tournament: Tournament;
}

export default function TournamentKnockoutMatchForm({
  match,
  teams,
  tournaments,
}: {
  match?: MatchProps | null;
  teams: Team[];
  tournaments: Tournament[];
}) {
  const params = useParams();
  const [error, action] = useFormState(
    !match
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
    <form action={action} className='space-y-8'>
      <div className='space-y-2 flex flex-col gap-1'>
        <Label htmlFor='tournamentId'>Tournament Name</Label>
        <select
          name='tournamentId'
          id='tournamentId'
          className='p-2 rounded-md'
          onChange={(e) => setTournamentId(e.target.value)}
          defaultValue={
            match?.tournamentEdition.tournamentId.toString() ||
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
            defaultValue={match?.tournamentEditionId.toString() || undefined}
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
      <div className='space-y-2 flex flex-col gap-1'>
        <Label htmlFor='homeTeamId'>Home Team</Label>
        <select
          name='homeTeamId'
          id='homeTeamId'
          className='p-2 rounded-md'
          defaultValue={match?.homeTeamId || undefined}
        >
          <option value='choose team'>Choose Team...</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        {/* {error?.message && <div className='text-destructive'>{error?.message}</div>} */}
      </div>
      <div className='space-y-2 flex flex-col gap-1'>
        <Label htmlFor='awayTeamId'>Away Team</Label>
        <select
          name='awayTeamId'
          id='awayTeamId'
          className='p-2 rounded-md'
          defaultValue={match?.awayTeamId || undefined}
        >
          <option value='choose team'>Choose Team...</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
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
          defaultValue={match?.round || ""}
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
      {/* <Input
        type='hidden'
        id='tournamentEditionId'
        name='tournamentEditionId'
        defaultValue={params.id}
      /> */}

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
