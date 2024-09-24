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

import { Group, Team, Tournament, TournamentEdition } from "@prisma/client";

import { useFormState } from "react-dom";
import { addTournamentGroup, updateTournamentGroup } from "@/actions/groups";

import PageHeader from "@/components/PageHeader";
import SubmitButton from "@/components/forms/parts/SubmitButton";
import FormField from "@/components/forms/parts/FormField";
import FormFieldError from "@/components/forms/parts/FormFieldError";
import FormFieldLoadingState from "@/components/forms/parts/FormFieldLoadingState";

import { useEffect, useRef, useState } from "react";

import MultipleSelector, {
  MultipleSelectorRef,
} from "@/components/ui/multiple-selector";

interface GroupProps extends Group {
  tournamentEdition: TournamentEditionProps;
  teams: Team[];
}

interface TournamentEditionProps extends TournamentEdition {
  tournament: Tournament;
}

export default function GroupForm({
  group,
  tournaments,
}: {
  group?: GroupProps | null;
  tournaments: Tournament[];
}) {
  const [error, action] = useFormState(
    group == null
      ? addTournamentGroup
      : updateTournamentGroup.bind(null, group.id),
    {}
  );

  const [tournamentId, setTournamentId] = useState<string | null>(
    group?.tournamentEdition.tournamentId.toString() ||
      (tournaments && tournaments.length > 0 && tournaments[0].id.toString()) ||
      null
  );

  const [isEditionsLoading, setIsEditionsLoading] = useState(false);

  const [tournamentsEditions, setTournamentsEditions] = useState<
    TournamentEditionProps[] | null
  >(null);

  const [tournamentEditionId, setTournamentEditionId] = useState<string | null>(
    group?.tournamentEditionId.toString() ||
      (tournamentsEditions &&
        tournamentsEditions.length > 0 &&
        tournamentsEditions[0].id.toString()) ||
      null
  );

  const [editionTeams, setEditionTeams] = useState<Team[] | null>(null);

  const [isTeamsLoading, setIsTeamsLoading] = useState(false);

  useEffect(() => {
    async function getEditions() {
      setIsEditionsLoading(true);

      // await new Promise((resolve) => {
      //   setTimeout(() => {}, 3000);
      // });

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
    async function getTeams() {
      setIsTeamsLoading(true);

      if (tournamentEditionId) {
        const res = await fetch("/api/editions-teams/" + tournamentEditionId);
        const data = await res.json();

        setEditionTeams(data.teams);
      }
      setIsTeamsLoading(false);
    }

    getTeams();
  }, [tournamentEditionId]);

  const teamsRef = useRef<MultipleSelectorRef>(null);
  const [hiddenTeams, setHiddenTeams] = useState<string>(
    (group &&
      group.teams.length > 0 &&
      group.teams
        .map((a) => {
          return a.id.toString();
        })
        .join(",")) ||
      ""
  );

  const [selectedTeams, setSelectedTeams] = useState(
    (group &&
      group.teams.length > 0 &&
      group.teams.map((a) => {
        return {
          label: a.name,
          value: a.name,
          dbValue: a.id.toString(),
        };
      })) ||
      undefined
  );

  return (
    <>
      <PageHeader label={group ? "Edit Group" : "Add Group"} />
      <form action={action} className="form-styles">
        {tournaments && tournaments.length > 0 ? (
          <FormField>
            <Label htmlFor="tournamentId">Tournament</Label>
            <Select
              name="tournamentId"
              defaultValue={
                group?.tournamentEdition.tournamentId.toString() ||
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
                tournamentsEditions[0].id.toString() ||
                group?.tournamentEditionId.toString() ||
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
        <FormField>
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            defaultValue={group?.name || ""}
          />
          <FormFieldError error={error?.name} />
        </FormField>
        {editionTeams && editionTeams.length > 0 && !isTeamsLoading ? (
          <FormField>
            <Label htmlFor="teams">Teams</Label>
            <Input type="hidden" id="teams" name="teams" value={hiddenTeams} />
            <MultipleSelector
              className="form-multiple-selector-styles"
              ref={teamsRef}
              defaultOptions={editionTeams.map(({ id, name }) => {
                return {
                  label: name,
                  value: name,
                  dbValue: id.toString(),
                };
              })}
              onChange={(options) => {
                setHiddenTeams(
                  options
                    .map((a) => {
                      return a.dbValue;
                    })
                    .join(",")
                );
              }}
              placeholder="Select teams you like to add to the group"
              emptyIndicator={
                <p className="empty-indicator">no teams found.</p>
              }
              value={selectedTeams}
            />
            <FormFieldError error={error?.teams} />
          </FormField>
        ) : (
          <FormFieldLoadingState
            isLoading={isTeamsLoading}
            label="Loading Teams..."
            notFoundText="There is no teams, add some!"
          />
        )}

        <SubmitButton
          isDisabled={
            !tournaments ||
            tournaments.length <= 0 ||
            isEditionsLoading ||
            !tournamentsEditions ||
            tournamentsEditions.length < 1
          }
        />
      </form>
    </>
  );
}
