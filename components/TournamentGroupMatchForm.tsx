"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormState, useFormStatus } from "react-dom";
import {
  addTournamentGroupMatch,
  updateTournamentGroupMatch,
} from "@/actions/tournamentsGroupMatches";
import {
  Match,
  Team,
  Tournament,
  TournamentEdition,
  Group,
} from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getUTCDateValueForDateTimeInput } from "@/lib/getFormattedDate";

interface MatchProps extends Match {
  tournamentEdition: TournamentEditionProps;
}

interface TournamentEditionProps extends TournamentEdition {
  tournament: Tournament;
}

export default function TournamentGroupMatchForm({
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
      ? addTournamentGroupMatch
      : updateTournamentGroupMatch.bind(null, match.id),
    {}
  );

  const [tournamentId, setTournamentId] = useState<string | null>(
    match?.tournamentEdition.tournamentId.toString() ||
      (tournaments && tournaments.length > 0 && tournaments[0].id.toString()) ||
      null
  );

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

  const [isEditionsLoading, setIsEditionsLoading] = useState(false);

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
      {tournamentsEditions &&
      tournamentsEditions.length > 0 &&
      !isEditionsLoading ? (
        <div className='space-y-2 flex flex-col gap-1'>
          <Label htmlFor='tournamentEditionId'>Tournament Edition Name</Label>
          <select
            name='tournamentEditionId'
            id='tournamentEditionId'
            className='p-2 rounded-md'
            onChange={(e) => setTournamentEditionId(e.target.value)}
            defaultValue={
              match?.tournamentEditionId.toString() ||
              tournamentEditionId ||
              undefined
            }
          >
            {tournamentsEditions.map((edi) => (
              <option key={edi.id} value={edi.id}>
                {`${edi.tournament.name} ${edi.year.toString()}`}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <>{isEditionsLoading && <p>Loading...</p>}</>
      )}
      {groups && groups.length > 0 && !isGroupsLoading ? (
        <div className='space-y-2 flex flex-col gap-1'>
          <Label htmlFor='groupId'>Group</Label>
          <select
            name='groupId'
            id='groupId'
            className='p-2 rounded-md'
            defaultValue={match?.groupId.toString() || undefined}
          >
            {groups.map((grp) => (
              <option key={grp.id} value={grp.id}>
                {grp.name}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <>{isGroupsLoading && <p>Loading...</p>}</>
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
      {/* <Input
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
