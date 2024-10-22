"use client";

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

import { useFormState } from "react-dom";
import { addLeagueGroup, updateLeagueGroup } from "@/actions/leagueGroups";

import PageHeader from "@/components/PageHeader";
import SubmitButton from "@/components/forms/parts/SubmitButton";
import FormField from "@/components/forms/parts/FormField";
import FormFieldError from "@/components/forms/parts/FormFieldError";
import FormFieldLoadingState from "@/components/forms/parts/FormFieldLoadingState";

import { useEffect, useRef, useState } from "react";

import MultipleSelector, {
  MultipleSelectorRef,
} from "@/components/ui/multiple-selector";

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
  const [error, action] = useFormState(
    group == null ? addLeagueGroup : updateLeagueGroup.bind(null, group.id),
    {}
  );

  const [leagueId, setLeagueId] = useState<string | null>(
    group?.season.leagueId.toString() ||
      (leagues && leagues.length > 0 && leagues[0].id.toString()) ||
      null
  );

  const [isSeasonsLoading, setIsSeasonsLoading] = useState(false);

  const [leaguesSeasons, setLeaguesSeasons] = useState<
    LeagueSeasonProps[] | null
  >(null);

  const [leagueSeasonId, setLeagueSeasonId] = useState<string | null>(
    group?.seasonId.toString() ||
      (leaguesSeasons &&
        leaguesSeasons.length > 0 &&
        leaguesSeasons[0].id.toString()) ||
      null
  );

  const [seasonTeams, setSeasonTeams] = useState<LeagueTeam[] | null>(null);

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

        setLeaguesSeasons(data);
        if (data.length > 0) {
          setLeagueSeasonId(data[0].id.toString());
        } else {
          setLeagueSeasonId(null);
        }
      }
      setIsSeasonsLoading(false);
    }

    getSeasons();
  }, [leagueId]);

  useEffect(() => {
    async function getTeams() {
      setIsTeamsLoading(true);

      if (leagueSeasonId) {
        const res = await fetch("/api/seasons-teams/" + leagueSeasonId);
        const data = await res.json();

        setSeasonTeams(data.teams);
        // if (data.teams.length < 1) setSeasonTeams(null);
      } else {
        setSeasonTeams(null);
      }
      setIsTeamsLoading(false);
    }

    getTeams();
  }, [leagueSeasonId]);

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
    <>
      <PageHeader label={group ? "Edit Group" : "Add Group"} />
      <form action={action} className="form-styles">
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
        {leaguesSeasons && leaguesSeasons.length > 0 && !isSeasonsLoading ? (
          <FormField>
            <Label htmlFor="seasonId">League Season</Label>
            <Select
              name="seasonId"
              defaultValue={
                leaguesSeasons[0].id.toString() ||
                group?.seasonId.toString() ||
                undefined
              }
              onValueChange={(value) => setLeagueSeasonId(value)}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Choose Season" />
              </SelectTrigger>
              <SelectContent>
                {leaguesSeasons.map(({ id, league, year }) => (
                  <SelectItem value={id.toString()} key={id}>
                    {`${league.name} ${year}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormFieldError error={error?.seasonId} />
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
          <FormFieldError error={error?.name} />
        </FormField>
        {seasonTeams && seasonTeams.length > 0 && !isTeamsLoading ? (
          <FormField>
            <Label htmlFor="teams">Teams</Label>
            <Input type="hidden" id="teams" name="teams" value={hiddenTeams} />
            <MultipleSelector
              className="form-multiple-selector-styles"
              ref={teamsRef}
              defaultOptions={seasonTeams.map(({ id, name }) => {
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
            <FormFieldError error={error?.teams} />
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
            !leaguesSeasons ||
            leaguesSeasons.length < 1 ||
            isTeamsLoading ||
            !seasonTeams ||
            seasonTeams.length < 1
          }
        />
      </form>
    </>
  );
}
