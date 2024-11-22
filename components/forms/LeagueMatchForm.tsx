"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  LeagueMatch,
  LeagueTeam,
  League,
  LeagueSeason,
  LeagueGroup,
  Country,
} from "@prisma/client";

import { addLeagueMatch, updateLeagueMatch } from "@/actions/leagueMatches";

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

import { getDateValueForDateTimeInput } from "@/lib/getFormattedDate";
import {
  searchLeague,
  searchSeason,
  searchLeagueGroup,
} from "@/lib/api-functions";

interface LeagueMatchProps extends LeagueMatch {
  season: LeagueSeasonProps;
  group: LeagueGroup | null;
  homeTeam: LeagueTeamProps;
  awayTeam: LeagueTeamProps;
}

interface LeagueSeasonProps extends LeagueSeason {
  league: LeagueProps;
}

interface LeagueProps extends League {
  country: Country | null;
}

interface LeagueTeamProps extends LeagueTeam {
  country: Country | null;
}

export default function LeagueMatchForm({
  leagueMatch,
}: {
  leagueMatch?: LeagueMatchProps | null;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  const [formState, formAction] = useFormState(
    leagueMatch == null
      ? addLeagueMatch
      : updateLeagueMatch.bind(null, leagueMatch.id),
    { errors: undefined, success: false, customError: null }
  );

  useEffect(() => {
    if (formState.success) {
      formRef.current?.reset();
      if (leagueMatch == null) {
        setHomeTeamValue(undefined);
        setHomeTeamKey(+new Date());

        setAwayTeamValue(undefined);
        setAwayTeamKey(+new Date());
      }
    }
  }, [formState]);

  const [selectedLeague, setSelectedLeague] = useState<Option[]>(
    leagueMatch
      ? [
          {
            dbValue: leagueMatch.season.leagueId.toString(),
            label: `${leagueMatch.season.league.name} ${
              leagueMatch.season.league.country
                ? `(${leagueMatch.season.league.country.name})`
                : `(${leagueMatch.season.league.type})`
            }`,
            value: `${leagueMatch.season.league.name} ${
              leagueMatch.season.league.country
                ? `(${leagueMatch.season.league.country.name})`
                : `(${leagueMatch.season.league.type})`
            }`,
          },
        ]
      : []
  );

  useEffect(() => {
    if (leagueMatch == null) {
      setSelectedSeason([]);
      setSeasonsKey(+new Date());

      setSelectedGroup([]);
      setGroupsKey(+new Date());
    }
  }, [selectedLeague, leagueMatch]);

  const [selectedSeason, setSelectedSeason] = useState<Option[]>(
    leagueMatch
      ? [
          {
            dbValue: leagueMatch?.seasonId.toString(),
            label: `${leagueMatch?.season.league.name} ${leagueMatch?.season.year}`,
            value: `${leagueMatch?.season.league.name} ${leagueMatch?.season.year}`,
          },
        ]
      : []
  );

  const [seasonsKey, setSeasonsKey] = useState(+new Date());

  const seasonsRef = useRef<MultipleSelectorRef>(null);

  const [selectedGroup, setSelectedGroup] = useState<Option[]>(
    leagueMatch && leagueMatch.groupId
      ? [
          {
            dbValue: leagueMatch.groupId.toString(),
            label: `${leagueMatch.group?.name}`,
            value: `${leagueMatch.group?.name}`,
          },
        ]
      : []
  );

  const [groupsKey, setGroupsKey] = useState(+new Date());

  const groupsRef = useRef<MultipleSelectorRef>(null);

  const [teams, setTeams] = useState<LeagueTeamProps[] | null>(null);

  const [isTeamsLoading, setIsTeamsLoading] = useState(false);

  useEffect(() => {
    async function getTeams() {
      setIsTeamsLoading(true);

      if (selectedGroup.length > 0) {
        const res = await fetch(
          "/api/league-groups-teams/" + selectedGroup[0].dbValue
        );
        const data = await res.json();

        setTeams(data.teams);
      } else if (selectedSeason.length > 0) {
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
  }, [selectedSeason, selectedGroup]);

  const [homeTeamValue, setHomeTeamValue] = useState<string | undefined>(
    leagueMatch?.homeTeamId.toString() || undefined
  );

  const [homeTeamKey, setHomeTeamKey] = useState(+new Date());

  const [awayTeamValue, setAwayTeamValue] = useState<string | undefined>(
    leagueMatch?.awayTeamId.toString() || undefined
  );

  const [awayTeamKey, setAwayTeamKey] = useState(+new Date());

  return (
    <div className="overflow-auto px-4">
      <PageHeader
        label={leagueMatch ? "Edit League Match" : "Add League Match"}
      />

      <FormSuccessMessage
        success={formState.success}
        message={`Match has been ${
          leagueMatch == null ? "added" : "updated"
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
            disabled={!!leagueMatch}
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
            disabled={!!leagueMatch || selectedLeague.length === 0}
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
              const res = await searchLeagueGroup(
                value,
                selectedSeason[0].dbValue
              );
              return res;
            }}
            maxSelected={1}
            placeholder="Select group"
            emptyIndicator={
              <MultipleSelectorEmptyIndicator label="No groups found" />
            }
            loadingIndicator={<MultipleSelectorLoadingIndicator />}
            ref={groupsRef}
            onChange={setSelectedGroup}
            value={selectedGroup}
            disabled={!!leagueMatch || selectedSeason.length === 0}
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
              leagueMatch?.date
                ? getDateValueForDateTimeInput(leagueMatch?.date)
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
                {teams.map(({ id, name, country }) => (
                  <SelectItem value={id.toString()} key={id}>
                    {name}{" "}
                    {country ? (
                      <Badge
                        variant="secondary"
                        className="text-muted-foreground text-xs ml-2"
                      >
                        {`${country.name}`}
                      </Badge>
                    ) : (
                      ""
                    )}
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
                {teams.map(({ id, name, country }) => (
                  <SelectItem value={id.toString()} key={id}>
                    {name}{" "}
                    {country ? (
                      <Badge
                        variant="secondary"
                        className="text-muted-foreground text-xs ml-2"
                      >
                        {`${country.name}`}
                      </Badge>
                    ) : (
                      ""
                    )}
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
              leagueMatch?.homeGoals !== null
                ? leagueMatch?.homeGoals.toString()
                : ""
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
              leagueMatch?.awayGoals !== null
                ? leagueMatch?.awayGoals.toString()
                : ""
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
            defaultValue={leagueMatch?.round || ""}
          />
          <FormFieldError error={formState.errors?.round} />
        </FormField>

        <SubmitButton
          isDisabled={
            selectedLeague.length === 0 ||
            selectedSeason.length === 0 ||
            isTeamsLoading ||
            !teams ||
            teams.length === 0
          }
        />
      </form>
    </div>
  );
}
