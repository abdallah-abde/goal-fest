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
  LeagueGroup,
  LeagueTeam,
  League,
  LeagueSeason,
  Country,
} from "@prisma/client";

import { addLeagueGroup, updateLeagueGroup } from "@/actions/leagueGroups";

import PageHeader from "@/components/PageHeader";
import SubmitButton from "@/components/forms/parts/SubmitButton";
import FormField from "@/components/forms/parts/FormField";
import FormFieldError from "@/components/forms/parts/FormFieldError";
import FormFieldLoadingState from "@/components/forms/parts/FormFieldLoadingState";

import MultipleSelector, {
  MultipleSelectorRef,
} from "@/components/ui/multiple-selector";

import { Ban, Check } from "lucide-react";

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
  leagues,
}: {
  group?: GroupProps | null;
  leagues: League[];
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
        setSelectedTeams(undefined);
        setTeamsKey(+new Date());
      }
    }
  }, [formState]);

  const [leagueId, setLeagueId] = useState<string | null>(
    group?.season.leagueId.toString() ||
      (leagues && leagues.length > 0 && leagues[0].id.toString()) ||
      null
  );

  const [isSeasonsLoading, setIsSeasonsLoading] = useState(false);

  const [seasons, setSeasons] = useState<LeagueSeasonProps[] | null>(null);

  const [seasonId, setSeasonId] = useState<string | null>(
    group?.seasonId.toString() ||
      (seasons && seasons.length > 0 && seasons[0].id.toString()) ||
      null
  );

  const [teams, setTeams] = useState<LeagueTeam[] | null>(null);

  const [isTeamsLoading, setIsTeamsLoading] = useState(false);

  useEffect(() => {
    async function getSeasons() {
      setIsSeasonsLoading(true);

      // await new Promise((resolve) => {
      //   setTimeout(() => {}, 3000);
      // });

      if (leagueId) {
        const res = await fetch("/api/leagues-seasons/" + leagueId);
        const data: LeagueSeasonProps[] = await res.json();

        setSeasons(data);
        if (data.length > 0) {
          setSeasonId(data[0].id.toString());
        } else {
          setSeasonId(null);
        }
      }
      setIsSeasonsLoading(false);
    }

    getSeasons();
  }, [leagueId]);

  useEffect(() => {
    async function getTeams() {
      setIsTeamsLoading(true);

      if (seasonId) {
        const res = await fetch("/api/seasons-teams/" + seasonId);
        const data = await res.json();

        setTeams(data.teams);
        // if (data.teams.length < 1) setSeasonTeams(null);
      } else {
        setTeams(null);
      }
      setIsTeamsLoading(false);
    }

    getTeams();
  }, [seasonId]);

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

  const [teamsKey, setTeamsKey] = useState(+new Date());

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
    <div className="overflow-auto px-4">
      <PageHeader label={group ? "Edit League Group" : "Add League Group"} />

      {formState.success && (
        <p className="p-2 px-3 rounded-md w-full bg-emerald-500/10 text-emerald-500 text-lg mb-2 text-center flex items-center gap-2">
          <Check size={20} />
          League Group has been {group == null ? "added" : "updated"}{" "}
          successfully
        </p>
      )}

      {formState.customError && (
        <p className="p-2 px-3 rounded-md w-full bg-destructive/10 text-destructive text-lg mb-2 text-center flex items-center gap-2">
          <Ban size={20} />
          {formState.customError}
        </p>
      )}

      <form action={formAction} className="form-styles" ref={formRef}>
        {leagues && leagues.length > 0 ? (
          <FormField>
            <Label htmlFor="leagueId">League</Label>
            <Select
              name="leagueId"
              defaultValue={
                group?.season.leagueId.toString() ||
                leagueId ||
                leagues[0].id.toString() ||
                undefined
              }
              onValueChange={(value) => setLeagueId(value)}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Choose League" />
              </SelectTrigger>
              <SelectContent>
                {leagues.map(({ id, name }) => (
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
            notFoundText="There is no Leagues, add some!"
          />
        )}
        {seasons && seasons.length > 0 && !isSeasonsLoading ? (
          <FormField>
            <Label htmlFor="seasonId">League Season</Label>
            <Select
              name="seasonId"
              defaultValue={
                group?.seasonId.toString() ||
                seasonId ||
                seasons[0].id.toString() ||
                undefined
              }
              onValueChange={(value) => setSeasonId(value)}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Choose Season" />
              </SelectTrigger>
              <SelectContent>
                {seasons.map(({ id, league, year }) => (
                  <SelectItem value={id.toString()} key={id}>
                    {`${league.name} ${year}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormFieldError error={formState.errors?.seasonId} />
          </FormField>
        ) : (
          <FormFieldLoadingState
            isLoading={isSeasonsLoading}
            label="Loading Seasons..."
            notFoundText="There is no seasons, add some!"
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
          <FormFieldError error={formState.errors?.name} />
        </FormField>
        {teams && teams.length > 0 && !isTeamsLoading ? (
          <FormField>
            <Label htmlFor="teams">Teams</Label>
            <Input type="hidden" id="teams" name="teams" value={hiddenTeams} />
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
            !leagues ||
            leagues.length <= 0 ||
            isSeasonsLoading ||
            !seasons ||
            seasons.length < 1 ||
            isTeamsLoading ||
            !teams ||
            teams.length < 1
          }
        />
      </form>
    </div>
  );
}
