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
} from "@/actions/tournamentsGroupMatches";

import PageHeader from "@/components/PageHeader";
import SubmitButton from "@/components/forms/SubmitButton";

import { useEffect, useState } from "react";

import { getUTCDateValueForDateTimeInput } from "@/lib/getFormattedDate";

import { LoadingSpinner } from "@/components/LoadingComponents";

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
        {tournamentsEditions &&
        tournamentsEditions.length > 0 &&
        !isEditionsLoading ? (
          <div className='space-y-2'>
            <Label htmlFor='tournamentEditionId'>Tournament Edition Name</Label>
            <div>
              <select
                name='tournamentEditionId'
                id='tournamentEditionId'
                className='p-2 rounded-md w-full bg-primary/50 placeholder:text-white text-white'
                onChange={(e) => setTournamentEditionId(e.target.value)}
                defaultValue={
                  match?.tournamentEditionId.toString() ||
                  tournamentEditionId ||
                  undefined
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
            {isEditionsLoading && (
              <>
                <p>Loading Editions...</p>
                <LoadingSpinner />
              </>
            )}
          </div>
        )}
        {groups && groups.length > 0 && !isGroupsLoading ? (
          <div className='space-y-2'>
            <Label htmlFor='groupId'>Group</Label>
            <select
              name='groupId'
              id='groupId'
              className='p-2 rounded-md w-full bg-primary/50 placeholder:text-white text-white'
              defaultValue={match?.groupId.toString() || undefined}
            >
              {groups.map((grp) => (
                <option
                  key={grp.id}
                  value={grp.id}
                  className='text-primary-foreground'
                >
                  {grp.name}
                </option>
              ))}
            </select>
            {error.groupId && (
              <div className='text-destructive'>{error.groupId}</div>
            )}
          </div>
        ) : (
          <div className='space-y-2 flex items-center justify-center gap-2'>
            {isGroupsLoading && (
              <>
                <p>Loading Groups...</p>
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
          <div>
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
          </div>
          {error?.awayTeamId && (
            <div className='text-destructive'>{error?.awayTeamId}</div>
          )}
        </div>
        <div className='space-y-2'>
          <Label htmlFor='homeGoals'>Home Goals</Label>
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
          <Label htmlFor='awayGoals'>Away Goals</Label>
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
        <div className='col-span-2'>
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
        </div>
      </form>
    </>
  );
}
