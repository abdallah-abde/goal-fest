"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";

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

import {
  addTournamentGroupMatch,
  updateTournamentGroupMatch,
} from "@/actions/groupMatches";

import PageHeader from "@/components/PageHeader";
import { MultipleSelectorLoadingIndicator } from "@/components/Skeletons";
import SubmitButton from "@/components/forms/parts/SubmitButton";
import FormField from "@/components/forms/parts/FormField";
import FormFieldError from "@/components/forms/parts/FormFieldError";
import FormFieldLoadingState from "@/components/forms/parts/FormFieldLoadingState";
import FormSuccessMessage from "@/components/forms/parts/FormSuccessMessage";
import FormCustomErrorMessage from "@/components/forms/parts/FormCustomErrorMessage";
import MultipleSelectorEmptyIndicator from "@/components/forms/parts/MultipleSelectorEmptyIndicator";

import MultipleSelector, {
  MultipleSelectorRef,
  Option,
} from "@/components/ui/multiple-selector";

import { getDateValueForDateTimeInput } from "@/lib/getFormattedDate";
import {
  searchTournament,
  searchEdition,
  searchGroup,
} from "@/lib/api-functions";

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
}: {
  match?: MatchProps | null;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  const [formState, formAction] = useFormState(
    match == null
      ? addTournamentGroupMatch
      : updateTournamentGroupMatch.bind(null, match.id),
    { errors: undefined, success: false, customError: null }
  );

  useEffect(() => {
    if (formState.success) {
      formRef.current?.reset();
      if (match == null) {
        setHomeTeamValue(undefined);
        setHomeTeamKey(+new Date());

        setAwayTeamValue(undefined);
        setAwayTeamKey(+new Date());
      }
    }
  }, [formState]);

  const [selectedTournament, setSelectedTournament] = useState<Option[]>(
    match
      ? [
          {
            dbValue: match.tournamentEdition.tournamentId.toString(),
            label: `${match.tournamentEdition.tournament.name} (${match.tournamentEdition.tournament.type})`,
            value: `${match.tournamentEdition.tournament.name} (${match.tournamentEdition.tournament.type})`,
          },
        ]
      : []
  );

  useEffect(() => {
    if (match == null) {
      setSelectedEdition([]);
      setEditionsKey(+new Date());

      setSelectedGroup([]);
      setGroupsKey(+new Date());
    }
  }, [selectedTournament, match]);

  const [selectedEdition, setSelectedEdition] = useState<Option[]>(
    match
      ? [
          {
            dbValue: match?.tournamentEditionId.toString(),
            label: `${match?.tournamentEdition.tournament.name} ${match?.tournamentEdition.year}`,
            value: `${match?.tournamentEdition.tournament.name} ${match?.tournamentEdition.year}`,
          },
        ]
      : []
  );

  useEffect(() => {
    if (match == null) {
      setSelectedGroup([]);
      setGroupsKey(+new Date());
    }
  }, [selectedEdition, match]);

  const [editionsKey, setEditionsKey] = useState(+new Date());

  const editionsRef = useRef<MultipleSelectorRef>(null);

  const [selectedGroup, setSelectedGroup] = useState<Option[]>(
    match
      ? [
          {
            dbValue: match.groupId.toString(),
            label: `${match.group.name}`,
            value: `${match.group.name}`,
          },
        ]
      : []
  );

  const [groupsKey, setGroupsKey] = useState(+new Date());

  const groupsRef = useRef<MultipleSelectorRef>(null);

  const [teams, setTeams] = useState<Team[] | null>(null);

  const [isTeamsLoading, setIsTeamsLoading] = useState(false);

  useEffect(() => {
    async function getTeams() {
      setIsTeamsLoading(true);

      if (selectedGroup.length > 0) {
        const res = await fetch(
          "/api/tournament-group-teams/" + selectedGroup[0].dbValue
        );
        const data = await res.json();

        setTeams(data.teams);
      } else if (selectedEdition.length > 0) {
        const res = await fetch(
          "/api/editions-teams/" + selectedEdition[0].dbValue
        );
        const data = await res.json();

        setTeams(data.teams);
      } else {
        setTeams([]);
      }
      setIsTeamsLoading(false);
    }

    getTeams();
  }, [selectedEdition, selectedGroup]);

  const [homeTeamValue, setHomeTeamValue] = useState<string | undefined>(
    match?.homeTeamId.toString() || undefined
  );

  const [homeTeamKey, setHomeTeamKey] = useState(+new Date());

  const [awayTeamValue, setAwayTeamValue] = useState<string | undefined>(
    match?.awayTeamId.toString() || undefined
  );

  const [awayTeamKey, setAwayTeamKey] = useState(+new Date());

  return (
    <div className="overflow-auto px-4">
      <PageHeader label={match ? "Edit Group Match" : "Add Group Match"} />

      <FormSuccessMessage
        success={formState.success}
        message={`Match has been ${
          match == null ? "added" : "updated"
        } successfully`}
      />

      <FormCustomErrorMessage customError={formState.customError} />

      <form action={formAction} className="form-styles" ref={formRef}>
        <FormField>
          <Label htmlFor="tournamentId">Tournament</Label>
          <Input
            type="hidden"
            id="tournamentId"
            name="tournamentId"
            value={selectedTournament[0]?.dbValue || ""}
          />
          <MultipleSelector
            className="form-multiple-selector-styles"
            hidePlaceholderWhenSelected
            hideClearAllButton
            badgeClassName="text-primary"
            onSearch={async (value) => {
              const res = await searchTournament(value);
              return res;
            }}
            maxSelected={1}
            placeholder="Select tournament"
            emptyIndicator={
              <MultipleSelectorEmptyIndicator label="No tournaments found" />
            }
            loadingIndicator={<MultipleSelectorLoadingIndicator />}
            onChange={setSelectedTournament}
            value={selectedTournament}
            disabled={!!match}
          />
        </FormField>

        <FormField>
          <Label htmlFor="tournamentEditionId">Edition</Label>
          <Input
            type="hidden"
            id="tournamentEditionId"
            name="tournamentEditionId"
            value={selectedEdition[0]?.dbValue || ""}
          />
          <MultipleSelector
            className="form-multiple-selector-styles"
            hidePlaceholderWhenSelected
            hideClearAllButton
            badgeClassName="text-primary"
            key={editionsKey}
            onSearch={async (value) => {
              const res = await searchEdition(
                value,
                selectedTournament[0].dbValue
              );
              return res;
            }}
            maxSelected={1}
            placeholder="Select edition"
            emptyIndicator={
              <MultipleSelectorEmptyIndicator label="No editions found" />
            }
            loadingIndicator={<MultipleSelectorLoadingIndicator />}
            ref={editionsRef}
            onChange={setSelectedEdition}
            value={selectedEdition}
            disabled={!!match || selectedTournament.length === 0}
          />
        </FormField>

        <FormField>
          <Label htmlFor="groupId">Group</Label>
          <Input
            type="hidden"
            id="groupId"
            name="groupId"
            value={selectedGroup[0]?.dbValue || ""}
          />
          <MultipleSelector
            className="form-multiple-selector-styles"
            hidePlaceholderWhenSelected
            hideClearAllButton
            badgeClassName="text-primary"
            key={groupsKey}
            onSearch={async (value) => {
              const res = await searchGroup(value, selectedEdition[0].dbValue);
              return res;
            }}
            maxSelected={1}
            placeholder="Select group"
            emptyIndicator={
              <MultipleSelectorEmptyIndicator label="No groups found" />
            }
            loadingIndicator={
              <p className="py-2 text-center text-lg leading-10 text-muted-foreground">
                Loading...
              </p>
            }
            ref={groupsRef}
            onChange={setSelectedGroup}
            value={selectedGroup}
            disabled={!!match || selectedEdition.length === 0}
          />
        </FormField>

        <FormField>
          <div className="flex items-baseline gap-4 mt-2">
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
          <FormFieldError error={formState.errors?.date} />
        </FormField>

        {teams && teams.length > 0 && !isTeamsLoading ? (
          <FormField>
            <Label htmlFor="homeTeamId">Home Team</Label>
            <Select
              name="homeTeamId"
              key={homeTeamKey}
              defaultValue={homeTeamValue}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Choose Home Team" />
              </SelectTrigger>
              <SelectContent>
                {teams.map(({ id, name }) => (
                  <SelectItem value={id.toString()} key={id}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormFieldError error={formState.errors?.homeTeamId} />
          </FormField>
        ) : (
          <FormFieldLoadingState
            isLoading={isTeamsLoading}
            label="Loading Teams..."
            notFoundText="There is no teams, add some!"
          />
        )}

        {teams && teams.length > 0 && !isTeamsLoading ? (
          <FormField>
            <Label htmlFor="awayTeamId">Away Team</Label>
            <Select
              name="awayTeamId"
              key={awayTeamKey}
              defaultValue={awayTeamValue}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Choose Away Team" />
              </SelectTrigger>
              <SelectContent>
                {teams.map(({ id, name }) => (
                  <SelectItem value={id.toString()} key={id}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormFieldError error={formState.errors?.awayTeamId} />
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
          <FormFieldError error={formState.errors?.homeGoals} />
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
          <FormFieldError error={formState.errors?.awayGoals} />
        </FormField>
        <FormField>
          <Label htmlFor="round">Round</Label>
          <Input
            type="text"
            id="round"
            name="round"
            defaultValue={match?.round || ""}
          />
          <FormFieldError error={formState.errors?.round} />
        </FormField>

        <SubmitButton
          isDisabled={
            selectedTournament.length === 0 ||
            selectedEdition.length === 0 ||
            selectedGroup.length === 0 ||
            isTeamsLoading
          }
        />
      </form>
    </div>
  );
}
