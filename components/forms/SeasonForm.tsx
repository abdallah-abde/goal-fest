"use client";

import Image from "next/image";

import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { LeagueSeason, League, LeagueTeam, Country } from "@prisma/client";

import { addLeagueSeason, updateLeagueSeason } from "@/actions/seasons";

import PageHeader from "@/components/PageHeader";
import SubmitButton from "@/components/forms/parts/SubmitButton";
import FormField from "@/components/forms/parts/FormField";
import FormFieldError from "@/components/forms/parts/FormFieldError";
import FormFieldLoadingState from "@/components/forms/parts/FormFieldLoadingState";

import { Ban, Check } from "lucide-react";

import MultipleSelector, {
  MultipleSelectorRef,
  Option,
} from "@/components/ui/multiple-selector";

interface LeagueSeasonProps extends LeagueSeason {
  league: LeagueProps;
  teams: LeagueTeam[];
}

interface LeagueProps extends League {
  country: Country | null;
}

export default function SeasonForm({
  leagueSeason,
}: {
  leagueSeason?: LeagueSeasonProps | null;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  const [formState, formAction] = useFormState(
    leagueSeason == null
      ? addLeagueSeason
      : updateLeagueSeason.bind(null, leagueSeason.id),
    { errors: undefined, success: false, customError: null }
  );

  useEffect(() => {
    if (formState.success) {
      formRef.current?.reset();
      if (leagueSeason == null) {
        setSelectedTeams([]);
        setTeamsKey(+new Date());
      }
    }
  }, [formState]);

  const [selectedLeague, setSelectedLeague] = useState<Option[]>(
    leagueSeason
      ? [
          {
            dbValue: leagueSeason.league.id.toString(),
            label: `${leagueSeason.league.name} ${
              leagueSeason.league.country
                ? `(${leagueSeason.league.country.name})`
                : `(${leagueSeason.league.type})`
            }`,
            value: `${leagueSeason.league.name} ${
              leagueSeason.league.country
                ? `(${leagueSeason.league.country.name})`
                : `(${leagueSeason.league.type})`
            }`,
          },
        ]
      : []
  );

  const searchLeague = async (value: string): Promise<Option[]> => {
    return new Promise(async (resolve) => {
      const res = await fetch("/api/leagues/" + value);
      const data = await res.json();
      resolve(data);
    });
  };

  const [teams, setTeams] = useState<LeagueTeam[] | null>(null);

  const [isTeamsLoading, setIsTeamsLoading] = useState(false);

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

    getTeams();
  }, [selectedLeague]);

  const teamsRef = useRef<MultipleSelectorRef>(null);
  const [teamsKey, setTeamsKey] = useState(+new Date());

  const [selectedTeams, setSelectedTeams] = useState<Option[]>(
    leagueSeason
      ? leagueSeason.teams.map(({ id, name }) => {
          return {
            label: name,
            value: name,
            dbValue: id.toString(),
          };
        })
      : []
  );

  return (
    <div className="overflow-auto px-4">
      <PageHeader
        label={leagueSeason ? "Edit League Season" : "Add League Season"}
      />

      {formState.success && (
        <p className="p-2 px-3 rounded-md w-full bg-emerald-500/10 text-emerald-500 text-lg mb-2 text-center flex items-center gap-2">
          <Check size={20} />
          League Season has been {leagueSeason == null
            ? "added"
            : "updated"}{" "}
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
            onSearch={async (value) => {
              const res = await searchLeague(value);
              return res;
            }}
            maxSelected={1}
            placeholder="Select league"
            emptyIndicator={
              <p className="empty-indicator">No leagues found.</p>
            }
            onChange={setSelectedLeague}
            value={selectedLeague}
            disabled={!!leagueSeason}
          />
          <FormFieldError error={formState.errors?.leagueId} />
        </FormField>

        <FormField>
          <Label htmlFor="startYear">Start Year</Label>
          <Input
            id="startYear"
            name="startYear"
            defaultValue={leagueSeason?.startYear || undefined}
          />
          <FormFieldError error={formState.errors?.startYear} />
        </FormField>
        <FormField>
          <Label htmlFor="endYear">End Year</Label>
          <Input
            id="endYear"
            name="endYear"
            defaultValue={leagueSeason?.endYear || undefined}
          />
          <FormFieldError error={formState.errors?.endYear} />
        </FormField>
        <FormField>
          <Label htmlFor="logoUrl">Logo</Label>
          <Input type="file" id="logoUrl" name="logoUrl" />
          {leagueSeason != null && leagueSeason?.logoUrl && (
            <div className="current-flag-wrapper">
              <Label>Current Logo</Label>
              <Image
                src={leagueSeason?.logoUrl || ""}
                height={150}
                width={150}
                alt={`${
                  (leagueSeason &&
                    leagueSeason.league &&
                    leagueSeason.league.name + " " + leagueSeason.year) ||
                  "League Season"
                } Logo`}
                className="aspect-video object-contain"
              />
              <FormFieldError error={formState.errors?.logoUrl} />
            </div>
          )}
        </FormField>
        {teams && teams.length > 0 && !isTeamsLoading ? (
          <FormField>
            <Label htmlFor="leagueTeams">Teams</Label>
            <Input
              type="hidden"
              id="leagueTeams"
              name="leagueTeams"
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
                <p className="empty-indicator">No teams found.</p>
              }
              loadingIndicator={
                <p className="py-2 text-center text-lg leading-10 text-muted-foreground">
                  loading...
                </p>
              }
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
          isDisabled={selectedLeague.length === 0 || isTeamsLoading}
        />
      </form>
    </div>
  );
}
