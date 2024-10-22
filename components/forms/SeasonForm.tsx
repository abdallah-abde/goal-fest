"use client";

import Image from "next/image";

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

import { useFormState } from "react-dom";
import { addLeagueSeason, updateLeagueSeason } from "@/actions/seasons";

import PageHeader from "@/components/PageHeader";
import SubmitButton from "@/components/forms/parts/SubmitButton";
import FormField from "@/components/forms/parts/FormField";
import FormFieldError from "@/components/forms/parts/FormFieldError";
import FormFieldLoadingState from "@/components/forms/parts/FormFieldLoadingState";

import { useRef, useState } from "react";

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
  const [error, action] = useFormState(
    leagueSeason == null
      ? addLeagueSeason
      : updateLeagueSeason.bind(null, leagueSeason.id),
    {}
  );

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
    <>
      <PageHeader
        label={leagueSeason ? "Edit League Season" : "Add League Season"}
      />
      <form action={action} className="form-styles">
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
            <FormFieldError error={error?.leagueId} />
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
          <FormFieldError error={error?.startYear} />
        </FormField>
        <FormField>
          <Label htmlFor="endYear">End Year</Label>
          <Input
            id="endYear"
            name="endYear"
            defaultValue={leagueSeason?.endYear || undefined}
          />
          <FormFieldError error={error?.endYear} />
        </FormField>
        <FormField>
          <Label htmlFor="logoUrl">Logo</Label>
          <Input type="file" id="logoUrl" name="logoUrl" />
          {leagueSeason != null && leagueSeason?.logoUrl && (
            <div className="current-flag-wrapper">
              <Label>Current Logo</Label>
              <Image
                src={leagueSeason?.logoUrl || ""}
                height="100"
                width="100"
                alt={`${
                  (leagueSeason &&
                    leagueSeason.league &&
                    leagueSeason.league.name + " " + leagueSeason.year) ||
                  "League Season"
                } Logo`}
                className="w-20 h-20"
              />
              <FormFieldError error={error?.logoUrl} />
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
          <FormFieldError error={error?.teams} />
        </FormField>
        <SubmitButton isDisabled={!leagues || leagues.length <= 0} />
      </form>
    </>
  );
}
