"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Group, Team, Tournament, TournamentEdition } from "@prisma/client";

import { addTournamentGroup, updateTournamentGroup } from "@/actions/groups";

import PageHeader from "@/components/PageHeader";
import { MultipleSelectorLoadingIndicator } from "@/components/LoadingComponents";
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

import { searchEdition, searchTournament } from "@/lib/api-functions";

interface GroupProps extends Group {
  tournamentEdition: TournamentEditionProps;
  teams: Team[];
}

interface TournamentEditionProps extends TournamentEdition {
  tournament: Tournament;
}

export default function GroupForm({ group }: { group?: GroupProps | null }) {
  const formRef = useRef<HTMLFormElement>(null);

  const [formState, formAction] = useFormState(
    group == null
      ? addTournamentGroup
      : updateTournamentGroup.bind(null, group.id),
    { errors: undefined, success: false, customError: null }
  );

  useEffect(() => {
    if (formState.success) {
      formRef.current?.reset();
      if (group == null) {
        setSelectedTeams([]);
        setTeamsKey(+new Date());
      }
    }
  }, [formState]);

  const [selectedTournament, setSelectedTournament] = useState<Option[]>(
    group
      ? [
          {
            dbValue: group.tournamentEdition.tournamentId.toString(),
            label: `${group.tournamentEdition.tournament.name} (${group.tournamentEdition.tournament.type})`,
            value: `${group.tournamentEdition.tournament.name} (${group.tournamentEdition.tournament.type})`,
          },
        ]
      : []
  );

  useEffect(() => {
    if (group == null) {
      setSelectedEdition([]);
      setEditionsKey(+new Date());
    }
  }, [selectedTournament, group]);

  const [selectedEdition, setSelectedEdition] = useState<Option[]>(
    group
      ? [
          {
            dbValue: group.tournamentEditionId.toString(),
            label: `${group.tournamentEdition.tournament.name} ${group.tournamentEdition.year}`,
            value: `${group.tournamentEdition.tournament.name} ${group.tournamentEdition.year}`,
          },
        ]
      : []
  );

  useEffect(() => {
    if (group == null) {
      setSelectedTeams([]);
      setTeamsKey(+new Date());
    }
  }, [selectedEdition, group]);

  const [editionsKey, setEditionsKey] = useState(+new Date());

  const editionsRef = useRef<MultipleSelectorRef>(null);

  const [teams, setTeams] = useState<Team[] | null>(null);

  const [isTeamsLoading, setIsTeamsLoading] = useState(false);

  useEffect(() => {
    async function getTeams() {
      setIsTeamsLoading(true);

      if (selectedEdition.length > 0) {
        const res = await fetch(
          "/api/editions-teams/" + selectedEdition[0].dbValue
        );
        const data = await res.json();

        setTeams(data.teams);
      } else {
        setTeams(null);
      }
      setIsTeamsLoading(false);
    }

    getTeams();
  }, [selectedEdition]);

  const teamsRef = useRef<MultipleSelectorRef>(null);
  const [teamsKey, setTeamsKey] = useState(+new Date());

  const [selectedTeams, setSelectedTeams] = useState<Option[]>(
    group
      ? group.teams.map((a) => {
          return {
            label: a.name,
            value: a.name,
            dbValue: a.id.toString(),
          };
        })
      : []
  );

  return (
    <div className="overflow-auto px-4">
      <PageHeader label={group ? "Edit Group" : "Add Group"} />

      <FormSuccessMessage
        success={formState.success}
        message={`Group has been ${
          group == null ? "added" : "updated"
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
            disabled={!!group}
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
            disabled={!!group || selectedTournament.length === 0}
          />
        </FormField>

        <FormField>
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            defaultValue={group?.name || ""}
          />
          <FormFieldError error={formState.errors?.name} />
        </FormField>
        {teams && teams.length > 0 && !isTeamsLoading ? (
          <FormField>
            <Label htmlFor="teams">Teams</Label>
            <Input
              type="hidden"
              id="teams"
              name="teams"
              value={
                selectedTeams
                  ?.map((a) => {
                    return a.dbValue;
                  })
                  .join(",") || ""
              }
            />
            <MultipleSelector
              className="form-multiple-selector-styles"
              ref={teamsRef}
              key={teamsKey}
              defaultOptions={teams.map(({ id, name }) => {
                return {
                  label: name,
                  value: name,
                  dbValue: id.toString(),
                };
              })}
              placeholder="Select teams"
              emptyIndicator={
                <MultipleSelectorEmptyIndicator label="No teams found" />
              }
              loadingIndicator={<MultipleSelectorLoadingIndicator />}
              onChange={setSelectedTeams}
              value={selectedTeams}
            />
            <FormFieldError error={formState.errors?.teams} />
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
            selectedTournament.length === 0 ||
            selectedEdition.length === 0 ||
            isTeamsLoading
          }
        />
      </form>
    </div>
  );
}
