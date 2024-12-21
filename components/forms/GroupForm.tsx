"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Group, Team, League, Season, Country } from "@prisma/client";

import { addGroup, updateGroup } from "@/actions/groups";

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
import { LeagueProps } from "@/types";

interface GroupProps extends Group {
  season: SeasonProps;
  teams: TeamProps[];
}

interface TeamProps extends Team {
  country: Country | null;
}

interface SeasonProps extends Season {
  league: LeagueProps;
}

export default function GroupForm({ group }: { group?: GroupProps | null }) {
  const formRef = useRef<HTMLFormElement>(null);

  const [formState, formAction] = useFormState(
    group == null ? addGroup : updateGroup.bind(null, group.id),
    { errors: undefined, success: false, customError: null }
  );

  useEffect(() => {
    if (formState.success) {
      formRef.current?.reset();
      if (group == null) {
        setTeamsKey(+new Date());
        setSelectedTeams([]);
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
                : `(${group.season.league.continent})`
            }`,
            value: `${group.season.league.name} ${
              group.season.league.country
                ? `(${group.season.league.country.name})`
                : `(${group.season.league.continent})`
            }`,
          },
        ]
      : []
  );

  useEffect(() => {
    if (group == null) {
      setSeasonsKey(+new Date());
      setSelectedSeason([]);
    }
  }, [selectedLeague, group]);

  const [selectedSeason, setSelectedSeason] = useState<Option[]>(
    group
      ? [
          {
            dbValue: group.seasonId.toString(),
            label: `${group.season.league.name} (${group.season.year})`,
            value: `${group.season.league.name} (${group.season.year})`,
          },
        ]
      : []
  );

  const [seasonsKey, setSeasonsKey] = useState(+new Date());

  const seasonsRef = useRef<MultipleSelectorRef>(null);

  const [teams, setTeams] = useState<Option[] | null>(null);

  const [isTeamsLoading, setIsTeamsLoading] = useState(false);

  // const [league, setLeague] = useState<League | null>(null);

  // const [isLeagueLoading, setIsLeagueLoading] = useState(false);

  useEffect(() => {
    async function getTeams() {
      setIsTeamsLoading(true);

      if (selectedSeason.length > 0) {
        const res = await fetch(
          "/api/seasons-teams/" + selectedSeason[0].dbValue
        );
        const data = await res.json();

        setTeams(data);
      } else {
        setTeams([]);
      }
      setIsTeamsLoading(false);
    }

    // async function getLeague() {
    //   setIsLeagueLoading(true);

    //   if (selectedLeague.length > 0) {
    //     const res = await fetch("/api/league/" + selectedLeague[0].dbValue);
    //     const data = await res.json();

    //     setLeague(data);
    //   } else {
    //     setLeague(null);
    //   }
    //   setIsLeagueLoading(false);
    // }

    getTeams();
    // getLeague();
  }, [selectedSeason]);

  const teamsRef = useRef<MultipleSelectorRef>(null);
  const [teamsKey, setTeamsKey] = useState(+new Date());

  const [selectedTeams, setSelectedTeams] = useState<Option[]>(
    group
      ? group.teams.map((a) => {
          return {
            label: `${a.name} (${a.isClub ? a.country?.name : a.continent})`,
            value: `${a.name} (${a.isClub ? a.country?.name : a.continent})`,
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
            // disabled={!!group}
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
            // disabled={!!group || selectedLeague.length === 0}
            disabled={selectedLeague.length === 0}
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
        {/* {teams && teams.length > 0 && !isTeamsLoading ? ( */}
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
            ref={teamsRef}
            key={teamsKey}
            className="form-multiple-selector-styles"
            hideClearAllButton
            hidePlaceholderWhenSelected
            badgeClassName="text-primary"
            options={teams || []}
            placeholder="Select teams"
            emptyIndicator={
              <MultipleSelectorEmptyIndicator label="No teams found" />
            }
            loadingIndicator={<MultipleSelectorLoadingIndicator />}
            onChange={setSelectedTeams}
            value={selectedTeams}
            disabled={selectedLeague.length === 0}
          />
          <FormFieldError error={formState.errors?.teams} />
        </FormField>
        {/* ) : (
          <FormFieldLoadingState
            isLoading={isTeamsLoading}
            label="Loading Teams..."
            notFoundText="There is no teams, add some!"
          /> */}
        {/* )} */}

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
