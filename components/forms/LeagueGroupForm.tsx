"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  LeagueGroup,
  LeagueTeam,
  League,
  LeagueSeason,
  Country,
} from "@prisma/client";

import { addLeagueGroup, updateLeagueGroup } from "@/actions/leagueGroups";

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

import { searchLeague, searchSeason } from "@/lib/api-functions";

interface GroupProps extends LeagueGroup {
  season: LeagueSeasonProps;
  teams: LeagueTeam[];
}

interface LeagueSeasonProps extends LeagueSeason {
  league: LeagueProps;
}

interface LeagueProps extends League {
  country: Country | null;
}

export default function LeagueGroupForm({
  group,
}: {
  group?: GroupProps | null;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  const [formState, formAction] = useFormState(
    group == null ? addLeagueGroup : updateLeagueGroup.bind(null, group.id),
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

  const [selectedLeague, setSelectedLeague] = useState<Option[]>(
    group
      ? [
          {
            dbValue: group.season.league.id.toString(),
            label: `${group.season.league.name} ${
              group.season.league.country
                ? `(${group.season.league.country.name})`
                : `(${group.season.league.type})`
            }`,
            value: `${group.season.league.name} ${
              group.season.league.country
                ? `(${group.season.league.country.name})`
                : `(${group.season.league.type})`
            }`,
          },
        ]
      : []
  );

  useEffect(() => {
    if (group == null) {
      setSelectedSeason([]);
      setSeasonsKey(+new Date());
    }
  }, [selectedLeague, group]);

  const [selectedSeason, setSelectedSeason] = useState<Option[]>(
    group
      ? [
          {
            dbValue: group.seasonId.toString(),
            label: `${group.season.league.name} ${group.season.year}`,
            value: `${group.season.league.name} ${group.season.year}`,
          },
        ]
      : []
  );

  const [seasonsKey, setSeasonsKey] = useState(+new Date());

  const seasonsRef = useRef<MultipleSelectorRef>(null);

  const [teams, setTeams] = useState<LeagueTeam[] | null>(null);

  const [isTeamsLoading, setIsTeamsLoading] = useState(false);

  useEffect(() => {
    async function getTeams() {
      setIsTeamsLoading(true);

      if (selectedSeason.length > 0) {
        const res = await fetch(
          "/api/seasons-teams/" + selectedSeason[0].dbValue
        );
        const data = await res.json();

        setTeams(data.teams);
      } else {
        setTeams([]);
      }
      setIsTeamsLoading(false);
    }

    getTeams();
  }, [selectedSeason]);

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
      <PageHeader label={group ? "Edit League Group" : "Add League Group"} />

      <FormSuccessMessage
        success={formState.success}
        message={`League Group has been ${
          group == null ? "added" : "updated"
        } successfully`}
      />

      <FormCustomErrorMessage customError={formState.customError} />

      <form action={formAction} className="form-styles" ref={formRef}>
        <FormField>
          <Label htmlFor="leagueId">League</Label>
          <Input
            type="hidden"
            id="leagueId"
            name="leagueId"
            value={selectedLeague[0]?.dbValue || ""}
          />
          <MultipleSelector
            className="form-multiple-selector-styles"
            hidePlaceholderWhenSelected
            hideClearAllButton
            badgeClassName="text-primary"
            onSearch={async (value) => {
              const res = await searchLeague(value);
              return res;
            }}
            maxSelected={1}
            placeholder="Select league"
            emptyIndicator={
              <MultipleSelectorEmptyIndicator label="No leagues found" />
            }
            loadingIndicator={<MultipleSelectorLoadingIndicator />}
            onChange={setSelectedLeague}
            value={selectedLeague}
            disabled={!!group}
          />
        </FormField>

        <FormField>
          <Label htmlFor="seasonId">Season</Label>
          <Input
            type="hidden"
            id="seasonId"
            name="seasonId"
            value={selectedSeason[0]?.dbValue || ""}
          />
          <MultipleSelector
            className="form-multiple-selector-styles"
            hidePlaceholderWhenSelected
            hideClearAllButton
            badgeClassName="text-primary"
            key={seasonsKey}
            onSearch={async (value) => {
              const res = await searchSeason(value, selectedLeague[0].dbValue);
              return res;
            }}
            maxSelected={1}
            placeholder="Select season"
            emptyIndicator={
              <MultipleSelectorEmptyIndicator label="No seasons found" />
            }
            loadingIndicator={<MultipleSelectorLoadingIndicator />}
            ref={seasonsRef}
            onChange={setSelectedSeason}
            value={selectedSeason}
            disabled={!!group || selectedLeague.length === 0}
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
            selectedLeague.length === 0 ||
            selectedSeason.length === 0 ||
            isTeamsLoading
          }
        />
      </form>
    </div>
  );
}
