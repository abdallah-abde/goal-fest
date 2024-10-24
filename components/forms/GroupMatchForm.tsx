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

import { getDateValueForDateTimeInput } from "@/lib/getFormattedDate";

interface MatchProps extends Match {
  tournamentEdition: TournamentEditionProps;
  group: Group;
  homeTeam: Team;
  awayTeam: Team;
}

interface TournamentEditionProps extends TournamentEdition {
  tournament: Tournament;
}

export default function GroupMatchForm({
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

  const [groupId, setGroupId] = useState<string | null>(
    match?.groupId.toString() ||
      (groups && groups.length > 0 && groups[0].id.toString()) ||
      null
  );

  const [groupTeams, setGroupTeams] = useState<Team[] | null>(null);

  const [isTeamsLoading, setIsTeamsLoading] = useState(false);

  useEffect(() => {
    async function getEditions() {
      setIsEditionsLoading(true);

      if (tournamentId) {
        const res = await fetch("/api/tournaments-editions/" + tournamentId);
        const data: TournamentEditionProps[] = await res.json();

        setTournamentsEditions(data);
        if (data.length > 0 && !match)
          setTournamentEditionId(data[0].id.toString());
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
        const data: Group[] = await res.json();

        setGroups(data);
        if (data.length > 0 && !match) setGroupId(data[0].id.toString());
      }
      setIsGroupsLoading(false);
    }

    getGroups();
  }, [tournamentEditionId]);

  useEffect(() => {
    async function getTeams() {
      setIsTeamsLoading(true);

      if (groupId) {
        const res = await fetch("/api/groups-teams/" + groupId);
        const data = await res.json();

        setGroupTeams(data.teams);
      }
      setIsTeamsLoading(false);
    }

    getTeams();
  }, [groupId]);

  return (
    <>
      <PageHeader label={match ? "Edit Group Match" : "Add Group Match"} />
      <form action={action} className="form-styles">
        {tournaments && tournaments.length > 0 ? (
          <FormField>
            <Label htmlFor="tournamentId">Tournament</Label>
            <Select
              name="tournamentId"
              defaultValue={
                match?.tournamentEdition.tournamentId.toString() ||
                tournamentId ||
                tournaments[0].id.toString() ||
                undefined
              }
              onValueChange={(value) => setTournamentId(value)}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Choose Tournament" />
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
            label=""
            notFoundText="There is no tournaments, add some!"
          />
        )}
        {tournamentsEditions &&
        tournamentsEditions.length > 0 &&
        !isEditionsLoading ? (
          <FormField>
            <Label htmlFor="tournamentEditionId">Tournament Edition</Label>
            <Select
              name="tournamentEditionId"
              defaultValue={
                match?.tournamentEditionId.toString() ||
                tournamentEditionId ||
                tournamentsEditions[0].id.toString() ||
                undefined
              }
              onValueChange={(value) => setTournamentEditionId(value)}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Choose Tournament Edition" />
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
            isLoading={isEditionsLoading}
            label="Loading Editions..."
            notFoundText="There is no editions, add some!"
          />
        )}
        {groups && groups.length > 0 && !isGroupsLoading ? (
          <FormField>
            <Label htmlFor="groupId">Group</Label>
            <Select
              name="groupId"
              defaultValue={
                match?.groupId.toString() ||
                groupId ||
                groups[0].id.toString() ||
                undefined
              }
              onValueChange={(value) => setGroupId(value)}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Choose Group" />
              </SelectTrigger>
              <SelectContent>
                {groups.map(({ id, name }) => (
                  <SelectItem value={id.toString()} key={id}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormFieldError error={error?.groupId} />
          </FormField>
        ) : (
          <FormFieldLoadingState
            isLoading={isGroupsLoading}
            label="Loading Groups..."
            notFoundText="There is no groups, add some!"
          />
        )}
        <FormField>
          <div className="flex items-baseline gap-4">
            <Label htmlFor="date">Date</Label>
            <span className="text-xs text-gray-500 font-semibold">
              Enter date-time in your local time
            </span>
          </div>
          <Input
            type="datetime-local"
            id="date"
            name="date"
            defaultValue={
              match?.date
                ? getDateValueForDateTimeInput(match?.date)
                : undefined
            }
          />
          <FormFieldError error={error?.date} />
        </FormField>
        {groupTeams && groupTeams.length > 0 && !isTeamsLoading ? (
          <FormField>
            <Label htmlFor="homeTeamId">Home Team</Label>
            <Select
              name="homeTeamId"
              defaultValue={
                (match && match?.homeTeamId.toString()) ||
                (groupTeams && groupTeams[0].id.toString()) ||
                undefined
              }
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Choose Home Team" />
              </SelectTrigger>
              <SelectContent>
                {groupTeams.map(({ id, name }) => (
                  <SelectItem value={id.toString()} key={id}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormFieldError error={error?.homeTeamId} />
          </FormField>
        ) : (
          <FormFieldLoadingState
            isLoading={isTeamsLoading}
            label="Loading Teams..."
            notFoundText="There is no teams, add some!"
          />
        )}
        {groupTeams && groupTeams.length > 0 && !isTeamsLoading ? (
          <FormField>
            <Label htmlFor="awayTeamId">Away Team</Label>
            <Select
              name="awayTeamId"
              defaultValue={
                match?.awayTeamId.toString() ||
                groupTeams[0].id.toString() ||
                undefined
              }
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Choose Away Team" />
              </SelectTrigger>
              <SelectContent>
                {groupTeams.map(({ id, name }) => (
                  <SelectItem value={id.toString()} key={id}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormFieldError error={error?.awayTeamId} />
          </FormField>
        ) : (
          <FormFieldLoadingState
            isLoading={isTeamsLoading}
            label="Loading Teams..."
            notFoundText="There is no teams, add some!"
          />
        )}
        <FormField>
          <Label htmlFor="homeGoals">Home Goals</Label>
          <Input
            type="text"
            id="homeGoals"
            name="homeGoals"
            defaultValue={
              match?.homeGoals !== null ? match?.homeGoals.toString() : ""
            }
          />
          <FormFieldError error={error?.homeGoals} />
        </FormField>
        <FormField>
          <Label htmlFor="awayGoals">Away Goals</Label>
          <Input
            type="text"
            id="awayGoals"
            name="awayGoals"
            defaultValue={
              match?.awayGoals !== null ? match?.awayGoals.toString() : ""
            }
          />
          <FormFieldError error={error?.awayGoals} />
        </FormField>
        <FormField>
          <Label htmlFor="round">Round</Label>
          <Input
            type="text"
            id="round"
            name="round"
            defaultValue={match?.round || ""}
          />
          <FormFieldError error={error?.round} />
        </FormField>

        <SubmitButton
          isDisabled={
            !tournaments ||
            tournaments.length <= 0 ||
            isEditionsLoading ||
            !tournamentsEditions ||
            tournamentsEditions.length <= 0 ||
            isGroupsLoading ||
            !groups ||
            groups.length <= 0 ||
            isTeamsLoading ||
            !groupTeams ||
            groupTeams.length <= 0
          }
        />
      </form>
    </>
  );
}
