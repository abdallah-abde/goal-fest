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

import { LeagueMatch, LeagueTeam, League, LeagueSeason } from "@prisma/client";

import { useFormState } from "react-dom";
import { addLeagueMatch, updateLeagueMatch } from "@/actions/leagueMatches";

import PageHeader from "@/components/PageHeader";
import SubmitButton from "@/components/forms/parts/SubmitButton";
import FormField from "@/components/forms/parts/FormField";
import FormFieldError from "@/components/forms/parts/FormFieldError";
import FormFieldLoadingState from "@/components/forms/parts/FormFieldLoadingState";

import { useEffect, useState } from "react";

import { getDateValueForDateTimeInput } from "@/lib/getFormattedDate";

interface LeagueMatchProps extends LeagueMatch {
  season: LeagueSeasonProps;
  homeTeam: LeagueTeam;
  awayTeam: LeagueTeam;
}

interface LeagueSeasonProps extends LeagueSeason {
  league: League;
}

export default function GroupMatchForm({
  leagueMatch,
  // teams,
  leagues,
}: {
  leagueMatch?: LeagueMatchProps | null;
  // teams: Team[];
  leagues: League[];
}) {
  const [error, action] = useFormState(
    leagueMatch == null
      ? addLeagueMatch
      : updateLeagueMatch.bind(null, leagueMatch.id),
    {}
  );

  const [leagueId, setLeagueId] = useState<string | null>(
    leagueMatch?.season.leagueId.toString() ||
      (leagues && leagues.length > 0 && leagues[0].id.toString()) ||
      null
  );

  const [isSeasonsLoading, setIsSeasonsLoading] = useState(false);

  const [seasons, setSeasons] = useState<LeagueSeasonProps[] | null>(null);

  const [seasonId, setSeasonId] = useState<string | null>(
    leagueMatch?.seasonId.toString() ||
      (seasons && seasons.length > 0 && seasons[0].id.toString()) ||
      null
  );

  const [seasonTeams, setSeasonTeams] = useState<LeagueTeam[] | null>(null);

  const [isTeamsLoading, setIsTeamsLoading] = useState(false);

  useEffect(() => {
    async function getSeasons() {
      setIsSeasonsLoading(true);

      if (leagueId) {
        const res = await fetch("/api/leagues-seasons/" + leagueId);
        const data: LeagueSeasonProps[] = await res.json();

        setSeasons(data);
        if (data.length > 0 && !leagueMatch) setSeasonId(data[0].id.toString());
        else setSeasonId(null);
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

        setSeasonTeams(data.teams);
      } else {
        setSeasonTeams([]);
      }
      setIsTeamsLoading(false);
    }

    getTeams();
  }, [seasonId]);

  return (
    <>
      <PageHeader
        label={leagueMatch ? "Edit League Match" : "Add League Match"}
      />
      <form action={action} className="form-styles">
        {leagues && leagues.length > 0 ? (
          <FormField>
            <Label htmlFor="leagueId">League</Label>
            <Select
              name="leagueId"
              defaultValue={
                leagueMatch?.season.leagueId.toString() ||
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
            notFoundText="There is no leagues, add some!"
          />
        )}
        {seasons && seasons.length > 0 && !isSeasonsLoading ? (
          <FormField>
            <Label htmlFor="seasonId">League Season</Label>
            <Select
              name="seasonId"
              defaultValue={
                leagueMatch?.seasonId.toString() ||
                seasonId ||
                seasons[0].id.toString() ||
                undefined
              }
              onValueChange={(value) => setSeasonId(value)}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Choose League Season" />
              </SelectTrigger>
              <SelectContent>
                {seasons.map(({ id, league, year }) => (
                  <SelectItem value={id.toString()} key={id}>
                    {`${league.name} ${year.toString()}`}
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
          <div className="flex items-baseline gap-4">
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
          <FormFieldError error={error?.date} />
        </FormField>
        {seasonTeams && seasonTeams.length > 0 && !isTeamsLoading ? (
          <FormField>
            <Label htmlFor="homeTeamId">Home Team</Label>
            <Select
              name="homeTeamId"
              defaultValue={
                (leagueMatch && leagueMatch?.homeTeamId.toString()) ||
                (seasonTeams && seasonTeams[0].id.toString()) ||
                undefined
              }
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Choose Home Team" />
              </SelectTrigger>
              <SelectContent>
                {seasonTeams.map(({ id, name }) => (
                  <SelectItem value={id.toString()} key={id}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormFieldError error={error?.homeTeamId} />
          </FormField>
        ) : (
          <FormFieldLoadingState
            isLoading={isTeamsLoading}
            label="Loading Teams..."
            notFoundText="There is no teams, add some!"
          />
        )}
        {seasonTeams && seasonTeams.length > 0 && !isTeamsLoading ? (
          <FormField>
            <Label htmlFor="awayTeamId">Away Team</Label>
            <Select
              name="awayTeamId"
              defaultValue={
                leagueMatch?.awayTeamId.toString() ||
                seasonTeams[0].id.toString() ||
                undefined
              }
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Choose Away Team" />
              </SelectTrigger>
              <SelectContent>
                {seasonTeams.map(({ id, name }) => (
                  <SelectItem value={id.toString()} key={id}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormFieldError error={error?.awayTeamId} />
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
          <FormFieldError error={error?.homeGoals} />
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
          <FormFieldError error={error?.awayGoals} />
        </FormField>
        <FormField>
          <Label htmlFor="round">Round</Label>
          <Input
            type="text"
            id="round"
            name="round"
            defaultValue={leagueMatch?.round || ""}
          />
          <FormFieldError error={error?.round} />
        </FormField>

        <SubmitButton
          isDisabled={
            !leagues ||
            leagues.length <= 0 ||
            isSeasonsLoading ||
            !seasons ||
            seasons.length <= 0 ||
            isTeamsLoading ||
            !seasonTeams ||
            seasonTeams.length <= 0
          }
        />
      </form>
    </>
  );
}
