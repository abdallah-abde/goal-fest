"use client";

import Image from "next/image";

import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Season, League, Team, Country } from "@prisma/client";

import { addLeagueSeason, updateLeagueSeason } from "@/actions/seasons";

import PageHeader from "@/components/PageHeader";
import {
  LoadingSpinner,
  MultipleSelectorLoadingIndicator,
} from "@/components/Skeletons";
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

import {
  searchCountry,
  searchLeague,
  searchLeagueCountry,
  searchLeagueTeam,
} from "@/lib/api-functions";

interface SeasonProps extends Season {
  league: LeagueProps;
  teams: TeamProps[];
  winner?: TeamProps | null;
  titleHolder?: TeamProps | null;
  hostingCountries: Country[];
}

interface TeamProps extends Team {
  country: Country | null;
}

interface LeagueProps extends League {
  country: Country | null;
}

export default function SeasonForm({
  season,
}: {
  season?: SeasonProps | null;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  const [formState, formAction] = useFormState(
    season == null ? addLeagueSeason : updateLeagueSeason.bind(null, season.id),
    { errors: undefined, success: false, customError: null }
  );

  useEffect(() => {
    if (formState.success) {
      formRef.current?.reset();
      if (season == null) {
        setTeamsKey(+new Date());
        setSelectedTeams([]);

        setCountriesKey(+new Date());
        setSelectedCountries([]);

        setWinnerKey(+new Date());
        setSelectedWinner([]);

        setTitleHolderKey(+new Date());
        setSelectedTitleHolder([]);
      }
    }
  }, [formState]);

  const [selectedLeague, setSelectedLeague] = useState<Option[]>(
    season
      ? [
          {
            dbValue: season.league.id.toString(),
            label: `${season.league.name} ${
              season.league.country
                ? `(${season.league.country.name})`
                : `(${season.league.continent})`
            }`,
            value: `${season.league.name} ${
              season.league.country
                ? `(${season.league.country.name})`
                : `(${season.league.continent})`
            }`,
          },
        ]
      : []
  );

  const [winnerKey, setWinnerKey] = useState(+new Date());
  const [titleHolderKey, setTitleHolderKey] = useState(+new Date());

  const [teams, setTeams] = useState<Team[] | null>(null);

  const [isTeamsLoading, setIsTeamsLoading] = useState(false);

  const [league, setLeague] = useState<League | null>(null);

  const [isLeagueLoading, setIsLeagueLoading] = useState(false);

  useEffect(() => {
    async function getTeams() {
      setIsTeamsLoading(true);

      if (selectedLeague.length > 0) {
        const res = await fetch(
          "/api/league-country-teams/" + selectedLeague[0].dbValue
        );
        const data = await res.json();

        setTeams(data);
      } else {
        setTeams([]);
      }
      setIsTeamsLoading(false);
    }

    async function getLeague() {
      setIsLeagueLoading(true);

      if (selectedLeague.length > 0) {
        const res = await fetch("/api/league/" + selectedLeague[0].dbValue);
        const data = await res.json();

        setLeague(data);
      } else {
        setLeague(null);
      }
      setIsLeagueLoading(false);
    }

    getTeams();
    getLeague();
  }, [selectedLeague]);

  const teamsRef = useRef<MultipleSelectorRef>(null);
  const [teamsKey, setTeamsKey] = useState(+new Date());

  const [selectedTeams, setSelectedTeams] = useState<Option[]>(
    season
      ? season.teams.map(({ id, name, country, continent }) => {
          return {
            label: `${name} (${continent})`,
            value: `${name} (${continent})`,
            dbValue: id.toString(),
          };
        })
      : []
  );

  const [countries, setCountries] = useState<Country[] | null>(null);

  const [isCountriesLoading, setIsCountriesLoading] = useState(false);

  useEffect(() => {
    async function getCountries() {
      setIsCountriesLoading(true);

      if (selectedLeague.length > 0) {
        const res = await fetch(
          "/api/season-countries/" + selectedLeague[0].dbValue
        );
        const data = await res.json();

        setCountries(data);
      } else {
        setCountries([]);
      }
      setIsCountriesLoading(false);
    }

    getCountries();
  }, [selectedLeague]);

  const countriesRef = useRef<MultipleSelectorRef>(null);
  const [countriesKey, setCountriesKey] = useState(+new Date());

  const [selectedCountries, setSelectedCountries] = useState<Option[]>(
    season
      ? season.hostingCountries.map(({ id, name }) => {
          return {
            label: name,
            value: name,
            dbValue: id.toString(),
          };
        })
      : []
  );

  const [selectedWinner, setSelectedWinner] = useState<Option[]>(
    season && season.winnerId
      ? [
          {
            dbValue: season.winnerId.toString(),
            label: `${season.winner?.name} (${
              season.winner?.isClub
                ? season.winner?.country?.name
                : season.winner?.continent
            })`,
            value: `${season.winner?.name} (${
              season.winner?.isClub
                ? season.winner?.country?.name
                : season.winner?.continent
            })`,
          },
        ]
      : []
  );

  const [selectedTitleHolder, setSelectedTitleHolder] = useState<Option[]>(
    season && season.titleHolderId
      ? [
          {
            dbValue: season.titleHolderId.toString(),
            label: `${season.titleHolder?.name} (${
              season.titleHolder?.isClub
                ? season.titleHolder?.country?.name
                : season.titleHolder?.continent
            })`,
            value: `${season.titleHolder?.name} (${
              season.titleHolder?.isClub
                ? season.titleHolder?.country?.name
                : season.titleHolder?.continent
            })`,
          },
        ]
      : []
  );

  return (
    <div className="overflow-auto px-4">
      <PageHeader label={season ? "Edit Season" : "Add Season"} />

      <FormSuccessMessage
        success={formState.success}
        message={`Season has been ${
          season == null ? "added" : "updated"
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
            hideClearAllButton
            hidePlaceholderWhenSelected
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
            // disabled={!!season}
          />
          <FormFieldError error={formState.errors?.leagueId} />
        </FormField>

        <FormField>
          <Label htmlFor="startYear">Start Year</Label>
          <Input
            id="startYear"
            name="startYear"
            defaultValue={season?.startYear || undefined}
          />
          <FormFieldError error={formState.errors?.startYear} />
        </FormField>
        <FormField>
          <Label htmlFor="endYear">End Year</Label>
          <Input
            id="endYear"
            name="endYear"
            defaultValue={season?.endYear || undefined}
          />
          <FormFieldError error={formState.errors?.endYear} />
        </FormField>
        <FormField>
          <Label htmlFor="flagUrl">Flag</Label>
          <Input type="file" id="flagUrl" name="flagUrl" />
          {season != null && season?.flagUrl && (
            <div className="current-flag-wrapper">
              <Label>Current Flag</Label>
              <Image
                src={season?.flagUrl || ""}
                height={150}
                width={150}
                alt={`${
                  (season &&
                    season.league &&
                    season.league.name + " " + season.year) ||
                  " Season"
                } Flag`}
                className="aspect-video object-contain"
              />
              <FormFieldError error={formState.errors?.flagUrl} />
            </div>
          )}
        </FormField>

        <FormField>
          <Label htmlFor="winnerId">Winner</Label>
          <Input
            type="hidden"
            id="winnerId"
            name="winnerId"
            value={selectedWinner[0]?.dbValue || ""}
          />
          <MultipleSelector
            key={winnerKey}
            className="form-multiple-selector-styles"
            hideClearAllButton
            hidePlaceholderWhenSelected
            badgeClassName="text-primary"
            onSearch={async (value) => {
              const res = await searchLeagueTeam(
                value,
                league?.continent || "",
                league?.countryId || null,
                league?.isClubs || false,
                league?.isDomestic || false
              );
              return res;
            }}
            maxSelected={1}
            placeholder="Select team"
            emptyIndicator={<p className="empty-indicator">No teams found.</p>}
            loadingIndicator={<MultipleSelectorLoadingIndicator />}
            onChange={setSelectedWinner}
            value={selectedWinner}
            disabled={selectedLeague.length === 0}
          />
          <FormFieldError error={formState.errors?.winnerId} />
        </FormField>

        <FormField>
          <Label htmlFor="titleHolderId">Title Holder</Label>
          <Input
            type="hidden"
            id="titleHolderId"
            name="titleHolderId"
            value={selectedTitleHolder[0]?.dbValue || ""}
          />
          <MultipleSelector
            key={titleHolderKey}
            className="form-multiple-selector-styles"
            hideClearAllButton
            hidePlaceholderWhenSelected
            badgeClassName="text-primary"
            onSearch={async (value) => {
              const res = await searchLeagueTeam(
                value,
                league?.continent || "",
                league?.countryId || null,
                league?.isClubs || false,
                league?.isDomestic || false
              );
              return res;
            }}
            maxSelected={1}
            placeholder="Select team"
            emptyIndicator={
              <MultipleSelectorEmptyIndicator label="No teams found" />
            }
            loadingIndicator={
              <p className="py-2 text-center text-lg leading-10 text-muted-foreground">
                Loading...
              </p>
            }
            onChange={setSelectedTitleHolder}
            value={selectedTitleHolder}
            disabled={selectedLeague.length === 0}
          />
          <FormFieldError error={formState.errors?.titleHolderId} />
        </FormField>

        {isLeagueLoading && <LoadingSpinner />}

        {league && league.isDomestic === false && (
          <FormField>
            <Label htmlFor="hostingCountries">Hosting Countries</Label>
            <Input
              type="hidden"
              id="hostingCountries"
              name="hostingCountries"
              value={
                selectedCountries
                  ?.map((a) => {
                    return a.dbValue;
                  })
                  .join(",") || ""
              }
            />
            <MultipleSelector
              ref={countriesRef}
              key={countriesKey}
              className="form-multiple-selector-styles"
              hideClearAllButton
              hidePlaceholderWhenSelected
              badgeClassName="text-primary"
              onSearch={async (value) => {
                const res = await searchLeagueCountry(value, league.continent);
                return res;
              }}
              placeholder="Select country"
              emptyIndicator={
                <MultipleSelectorEmptyIndicator label="No countries found" />
              }
              loadingIndicator={<MultipleSelectorLoadingIndicator />}
              onChange={setSelectedCountries}
              value={selectedCountries}
              disabled={selectedLeague.length === 0}

              // disabled={!!league}
            />
            <FormFieldError error={formState.errors?.hostingCountries} />
          </FormField>
        )}

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
            onSearch={async (value) => {
              const res = await searchLeagueTeam(
                value,
                league?.continent || "",
                league?.countryId || null,
                league?.isClubs || false,
                league?.isDomestic || false
              );
              return res;
            }}
            placeholder="Select team"
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

        {/* {teams && teams.length > 0 && !isTeamsLoading ? (
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
        )} */}
        <SubmitButton
          isDisabled={
            selectedLeague.length === 0 ||
            isTeamsLoading ||
            isCountriesLoading ||
            isLeagueLoading
          }
        />
      </form>
    </div>
  );
}
