"use client";

import Image from "next/image";

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

import { LeagueSeason, League, LeagueTeam } from "@prisma/client";

import { addLeagueSeason, updateLeagueSeason } from "@/actions/seasons";

import PageHeader from "@/components/PageHeader";
import SubmitButton from "@/components/forms/parts/SubmitButton";
import FormField from "@/components/forms/parts/FormField";
import FormFieldError from "@/components/forms/parts/FormFieldError";
import FormFieldLoadingState from "@/components/forms/parts/FormFieldLoadingState";

import { Ban, Check } from "lucide-react";

import MultipleSelector, {
  MultipleSelectorRef,
} from "@/components/ui/multiple-selector";

interface LeagueSeasonProps extends LeagueSeason {
  league: League;
  teams: LeagueTeam[];
}

export default function SeasonForm({
  leagueSeason,
  leagues,
  teams,
}: {
  leagueSeason?: LeagueSeasonProps | null;
  leagues: League[];
  teams: LeagueTeam[];
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
        setSelectedTeams(undefined);
        setTeamsKey(+new Date());
      }
    }
  }, [formState]);

  const teamsRef = useRef<MultipleSelectorRef>(null);
  const [hiddenTeams, setHiddenTeams] = useState<string>(
    (leagueSeason &&
      leagueSeason.teams.length > 0 &&
      leagueSeason.teams
        .map(({ id }) => {
          return id.toString();
        })
        .join(",")) ||
      ""
  );

  const [teamsKey, setTeamsKey] = useState(+new Date());

  const [selectedTeams, setSelectedTeams] = useState(
    (leagueSeason &&
      leagueSeason.teams.length > 0 &&
      leagueSeason.teams.map(({ id, name }) => {
        return {
          label: name,
          value: name,
          dbValue: id.toString(),
        };
      })) ||
      undefined
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
        {leagues && leagues.length > 0 ? (
          <FormField>
            <Label htmlFor="leagueId">League Name</Label>
            <Select
              name="leagueId"
              defaultValue={
                (leagueSeason?.leagueId && leagueSeason?.leagueId.toString()) ||
                leagues[0].id.toString() ||
                undefined
              }
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
            <FormFieldError error={formState.errors?.leagueId} />
          </FormField>
        ) : (
          <FormFieldLoadingState
            isLoading={false}
            label=""
            notFoundText="There is no leagues, add some!"
          />
        )}
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
        <FormField>
          <Label htmlFor="leagueTeams">Teams</Label>
          <Input
            type="hidden"
            id="leagueTeams"
            name="leagueTeams"
            value={hiddenTeams}
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
            onChange={(options) => {
              setHiddenTeams(
                options
                  .map((a) => {
                    return a.dbValue;
                  })
                  .join(",")
              );
            }}
            placeholder="Select teams you like to add to the league"
            emptyIndicator={<p className="empty-indicator">No teams found.</p>}
            value={selectedTeams}
          />
          <FormFieldError error={formState.errors?.teams} />
        </FormField>
        <SubmitButton isDisabled={!leagues || leagues.length <= 0} />
      </form>
    </div>
  );
}
