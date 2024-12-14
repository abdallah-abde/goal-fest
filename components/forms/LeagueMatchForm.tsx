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

import { Match, Team, League, Season, Group, Country } from "@prisma/client";

import { addLeagueMatch, updateLeagueMatch } from "@/actions/leagueMatches";

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
  searchLeague,
  searchSeason,
  searchLeagueGroup,
  searchLeagueTeam,
  searchTeamMatch,
} from "@/lib/api-functions";
import { IsPopularOptions } from "@/types/enums";

interface MatchProps extends Match {
  season: SeasonProps;
  group: Group | null;
  homeTeam: TeamProps | null;
  awayTeam: TeamProps | null;
}

interface SeasonProps extends Season {
  league: LeagueProps;
  groups: Group[];
}

interface LeagueProps extends League {
  country: Country | null;
}

interface TeamProps extends Team {
  country: Country | null;
}

export default function LeagueMatchForm({
  match,
}: {
  match?: MatchProps | null;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  const [formState, formAction] = useFormState(
    match == null ? addLeagueMatch : updateLeagueMatch.bind(null, match.id),
    { errors: undefined, success: false, customError: null }
  );

  useEffect(() => {
    if (formState.success) {
      formRef.current?.reset();
      if (match == null) {
        setHomeTeamKey(+new Date());
        setAwayTeamKey(+new Date());

        setIsKnockoutValue(IsPopularOptions.No);
        setIsKnockoutKey(+new Date());
      }
    }
  }, [formState]);

  const [selectedLeague, setSelectedLeague] = useState<Option[]>(
    match
      ? [
          {
            dbValue: match.season.leagueId.toString(),
            label: `${match.season.league.name} ${
              match.season.league.country
                ? `(${match.season.league.country.name})`
                : `(${match.season.league.continent})`
            }`,
            value: `${match.season.league.name} ${
              match.season.league.country
                ? `(${match.season.league.country.name})`
                : `(${match.season.league.continent})`
            }`,
          },
        ]
      : []
  );

  useEffect(() => {
    if (match == null) {
      setSelectedSeason([]);
      setSeasonsKey(+new Date());

      setSelectedGroup([]);
      setGroupsKey(+new Date());

      setSelectedHomeTeam([]);
      setHomeTeamKey(+new Date());

      setSelectedAwayTeam([]);
      setAwayTeamKey(+new Date());
    }
  }, [selectedLeague, match]);

  const [selectedSeason, setSelectedSeason] = useState<Option[]>(
    match
      ? [
          {
            dbValue: match?.seasonId.toString(),
            label: `${match?.season.league.name} ${match?.season.year}`,
            value: `${match?.season.league.name} ${match?.season.year}`,
          },
        ]
      : []
  );

  useEffect(() => {
    if (match == null) {
      setSelectedGroup([]);
      setGroupsKey(+new Date());

      setSelectedHomeTeam([]);
      setHomeTeamKey(+new Date());

      setSelectedAwayTeam([]);
      setAwayTeamKey(+new Date());
    }
  }, [selectedSeason, match]);

  const [seasonsKey, setSeasonsKey] = useState(+new Date());

  const seasonsRef = useRef<MultipleSelectorRef>(null);

  const [season, setSeason] = useState<SeasonProps | null>(null);

  const [isSeasonLoading, setIsSeasonLoading] = useState(false);

  useEffect(() => {
    async function getSeason() {
      setIsSeasonLoading(true);

      if (selectedSeason.length > 0) {
        const res = await fetch("/api/season/" + selectedSeason[0].dbValue);
        const data = await res.json();

        setSeason(data);
      } else {
        setSeason(null);
      }
      setIsSeasonLoading(false);
    }
    getSeason();
  }, [selectedSeason]);

  const [selectedGroup, setSelectedGroup] = useState<Option[]>(
    match && match.groupId
      ? [
          {
            dbValue: match.groupId.toString(),
            label: `${match.group?.name}`,
            value: `${match.group?.name}`,
          },
        ]
      : []
  );

  useEffect(() => {
    if (match == null) {
      setSelectedHomeTeam([]);
      setHomeTeamKey(+new Date());

      setSelectedAwayTeam([]);
      setAwayTeamKey(+new Date());
    }
  }, [selectedGroup, match]);

  const [groupsKey, setGroupsKey] = useState(+new Date());

  const groupsRef = useRef<MultipleSelectorRef>(null);

  const [teams, setTeams] = useState<TeamProps[] | null>(null);

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

  const [selectedHomeTeam, setSelectedHomeTeam] = useState<Option[]>(
    match
      ? [
          {
            dbValue: match.homeTeamId?.toString(),
            label: `${match.homeTeam?.name}`,
            value: `${match.homeTeam?.name}`,
          },
        ]
      : []
  );

  const [homeTeamKey, setHomeTeamKey] = useState(+new Date());
  const homeTeamRef = useRef<MultipleSelectorRef>(null);

  const [selectedAwayTeam, setSelectedAwayTeam] = useState<Option[]>(
    match
      ? [
          {
            dbValue: match.awayTeamId?.toString(),
            label: `${match.awayTeam?.name}`,
            value: `${match.awayTeam?.name}`,
          },
        ]
      : []
  );

  const [awayTeamKey, setAwayTeamKey] = useState(+new Date());
  const awayTeamRef = useRef<MultipleSelectorRef>(null);

  // const [homeTeamValue, setHomeTeamValue] = useState<string | undefined>(
  //   match?.homeTeamId?.toString() || undefined
  // );

  // const [awayTeamValue, setAwayTeamValue] = useState<string | undefined>(
  //   match?.awayTeamId?.toString() || undefined
  // );

  const [isKnockoutValue, setIsKnockoutValue] = useState<string | undefined>(
    match?.isKnockout === true
      ? IsPopularOptions.Yes
      : IsPopularOptions.No || undefined
  );
  const [isKnockoutKey, setIsKnockoutKey] = useState(+new Date());

  return (
    <div className="overflow-auto px-4">
      <PageHeader label={match ? "Edit Match" : "Add Match"} />

      <FormSuccessMessage
        success={formState.success}
        message={`Match has been ${
          match == null ? "added" : "updated"
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
            // disabled={!!leagueMatch}
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
            disabled={selectedLeague.length === 0}
          />
        </FormField>

        <FormField>
          <Label htmlFor="isKnockout">Is Knockout</Label>
          <Select
            name="isKnockout"
            key={isKnockoutKey}
            defaultValue={isKnockoutValue || undefined}
            onValueChange={(value) => setIsKnockoutValue(value)}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Choose Knockout Option" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(IsPopularOptions).map((option) => (
                <SelectItem value={option} key={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormFieldError error={formState.errors?.isKnockout} />
        </FormField>

        {season &&
          season.groups.length > 0 &&
          isKnockoutValue === IsPopularOptions.No && (
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
                disabled={selectedSeason.length === 0}
              />
            </FormField>
          )}

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

        <FormField>
          <Label htmlFor="homeTeamId">Home Team</Label>
          <Input
            type="hidden"
            id="homeTeamId"
            name="homeTeamId"
            value={selectedHomeTeam[0]?.dbValue || ""}
          />
          <MultipleSelector
            className="form-multiple-selector-styles"
            hidePlaceholderWhenSelected
            hideClearAllButton
            badgeClassName="text-primary"
            key={homeTeamKey}
            onSearch={async (value) => {
              const res = await searchTeamMatch(
                value,
                selectedSeason[0].dbValue,
                selectedGroup.length > 0 ? selectedGroup[0].dbValue : undefined
              );
              return res;
            }}
            maxSelected={1}
            placeholder="Select team"
            emptyIndicator={
              <MultipleSelectorEmptyIndicator label="No teams found" />
            }
            loadingIndicator={<MultipleSelectorLoadingIndicator />}
            ref={homeTeamRef}
            onChange={setSelectedHomeTeam}
            value={selectedHomeTeam}
            // disabled={!!group || selectedLeague.length === 0}
            disabled={
              selectedLeague.length === 0 ||
              selectedSeason.length === 0 ||
              (season && season.groups.length > 0
                ? selectedGroup.length === 0
                : false)
            }
          />
        </FormField>

        {/* {teams && teams.length > 0 && !isTeamsLoading ? (
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
        )} */}

        <FormField>
          <Label htmlFor="awayTeamId">Away Team</Label>
          <Input
            type="hidden"
            id="awayTeamId"
            name="awayTeamId"
            value={selectedAwayTeam[0]?.dbValue || ""}
          />
          <MultipleSelector
            className="form-multiple-selector-styles"
            hidePlaceholderWhenSelected
            hideClearAllButton
            badgeClassName="text-primary"
            key={awayTeamKey}
            onSearch={async (value) => {
              const res = await searchTeamMatch(
                value,
                selectedSeason[0].dbValue,
                selectedGroup.length > 0 ? selectedGroup[0].dbValue : undefined
              );
              return res;
            }}
            maxSelected={1}
            placeholder="Select team"
            emptyIndicator={
              <MultipleSelectorEmptyIndicator label="No teams found" />
            }
            loadingIndicator={<MultipleSelectorLoadingIndicator />}
            ref={awayTeamRef}
            onChange={setSelectedAwayTeam}
            value={selectedAwayTeam}
            disabled={
              selectedLeague.length === 0 ||
              selectedSeason.length === 0 ||
              (season && season.groups.length > 0
                ? selectedGroup.length === 0
                : false)
            }
            // disabled={selectedLeague.length === 0}
          />
        </FormField>

        {/* {teams && teams.length > 0 && !isTeamsLoading ? (
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
        )} */}

        <FormField>
          <Label htmlFor="homeGoals">
            {isKnockoutValue === IsPopularOptions.No
              ? "Home Goals"
              : "Home Main Time Goals"}
          </Label>
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
          <Label htmlFor="awayGoals">
            {isKnockoutValue === IsPopularOptions.No
              ? "Away Goals"
              : "Away Main Time Goals"}
          </Label>
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

        {isKnockoutValue === IsPopularOptions.Yes && (
          <>
            <FormField>
              <Label htmlFor="homeExtraTimeGoals">Home Extra Time Goals</Label>
              <Input
                type="text"
                id="homeExtraTimeGoals"
                name="homeExtraTimeGoals"
                defaultValue={
                  match?.homeExtraTimeGoals !== null
                    ? match?.homeExtraTimeGoals.toString()
                    : ""
                }
              />
              <FormFieldError error={formState.errors?.homeExtraTimeGoals} />
            </FormField>

            <FormField>
              <Label htmlFor="awayExtraTimeGoals">Away Extra Time Goals</Label>
              <Input
                type="text"
                id="awayExtraTimeGoals"
                name="awayExtraTimeGoals"
                defaultValue={
                  match?.awayExtraTimeGoals !== null
                    ? match?.awayExtraTimeGoals.toString()
                    : ""
                }
              />
              <FormFieldError error={formState.errors?.awayExtraTimeGoals} />
            </FormField>

            <FormField>
              <Label htmlFor="homePenaltyGoals">Home Penalty</Label>
              <Input
                type="text"
                id="homePenaltyGoals"
                name="homePenaltyGoals"
                defaultValue={
                  match?.homePenaltyGoals !== null
                    ? match?.homePenaltyGoals.toString()
                    : ""
                }
              />
              <FormFieldError error={formState.errors?.homePenaltyGoals} />
            </FormField>

            <FormField>
              <Label htmlFor="awayPenaltyGoals">Away Penalty</Label>
              <Input
                type="text"
                id="awayPenaltyGoals"
                name="awayPenaltyGoals"
                defaultValue={
                  match?.awayPenaltyGoals !== null
                    ? match?.awayPenaltyGoals.toString()
                    : ""
                }
              />
              <FormFieldError error={formState.errors?.awayPenaltyGoals} />
            </FormField>
          </>
        )}

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

        <FormField>
          <Label htmlFor="homeTeamPlacehlder">Home Team Placeholder</Label>
          <Input
            type="text"
            id="homeTeamPlacehlder"
            name="homeTeamPlacehlder"
            defaultValue={
              match?.homeTeamPlacehlder ? match?.homeTeamPlacehlder : ""
            }
          />
          <FormFieldError error={formState.errors?.homeTeamPlacehlder} />
        </FormField>

        <FormField>
          <Label htmlFor="awayTeamPlacehlder">Away Team Placeholder</Label>
          <Input
            type="text"
            id="awayTeamPlacehlder"
            name="awayTeamPlacehlder"
            defaultValue={
              match?.awayTeamPlacehlder ? match?.awayTeamPlacehlder : ""
            }
          />
          <FormFieldError error={formState.errors?.awayTeamPlacehlder} />
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
