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
import { Button } from "@/components/ui/button";

import { Eraser } from "lucide-react";

import {
  LeagueKnockoutMatch,
  LeagueTeam,
  League,
  LeagueSeason,
  Country,
} from "@prisma/client";

import {
  addLeagueKnockoutMatch,
  updateLeagueKnockoutMatch,
} from "@/actions/leagueKnockoutMatches";

import PageHeader from "@/components/PageHeader";
import SubmitButton from "@/components/forms/parts/SubmitButton";
import FormField from "@/components/forms/parts/FormField";
import FormFieldError from "@/components/forms/parts/FormFieldError";
import FormFieldLoadingState from "@/components/forms/parts/FormFieldLoadingState";

import { getDateValueForDateTimeInput } from "@/lib/getFormattedDate";

import { Ban, Check } from "lucide-react";

interface MatchProps extends LeagueKnockoutMatch {
  season: LeagueSeasonProps;
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

export default function LeagueKnockoutMatchForm({
  match,
  leagues,
}: {
  match?: MatchProps | null;
  leagues: League[];
}) {
  const formRef = useRef<HTMLFormElement>(null);

  const [formState, formAction] = useFormState(
    match == null
      ? addLeagueKnockoutMatch
      : updateLeagueKnockoutMatch.bind(null, match.id),
    { errors: undefined, success: false, customError: null }
  );

  useEffect(() => {
    if (formState.success) {
      formRef.current?.reset();
      if (match == null) {
        setHomeTeamValue(undefined);
        setHomeTeamKey(+new Date());

        setAwayTeamValue(undefined);
        setAwayTeamKey(+new Date());
      }
    }
  }, [formState]);

  const [leagueId, setLeagueId] = useState<string | null>(
    match?.season.leagueId.toString() ||
      (leagues && leagues.length > 0 && leagues[0].id.toString()) ||
      null
  );

  const [isSeasonsLoading, setIsSeasonsLoading] = useState(false);

  const [seasons, setSeasons] = useState<LeagueSeasonProps[] | null>(null);

  const [seasonId, setSeasonId] = useState<string | null>(
    match?.seasonId.toString() ||
      (seasons && seasons.length > 0 && seasons[0].id.toString()) ||
      null
  );

  const [teams, setTeams] = useState<LeagueTeamProps[] | null>(null);

  const [isTeamsLoading, setIsTeamsLoading] = useState(false);

  const [homeTeamValue, setHomeTeamValue] = useState<number | undefined>(
    match?.homeTeamId || undefined
  );

  const [homeTeamKey, setHomeTeamKey] = useState(+new Date());

  const [awayTeamValue, setAwayTeamValue] = useState<number | undefined>(
    match?.awayTeamId || undefined
  );

  const [awayTeamKey, setAwayTeamKey] = useState(+new Date());

  useEffect(() => {
    async function getSeasons() {
      setIsSeasonsLoading(true);

      if (leagueId) {
        const res = await fetch("/api/leagues-seasons/" + leagueId);
        const data = await res.json();

        setSeasons(data);

        if (data.length > 0 && !match) setSeasonId(data[0].id.toString());
      }
      setIsSeasonsLoading(false);
    }

    getSeasons();
  }, [leagueId]);

  useEffect(() => {
    async function getLeagueTeams() {
      setIsTeamsLoading(true);

      if (seasonId) {
        const res = await fetch("/api/seasons-teams/" + seasonId);
        const data = await res.json();

        setTeams(data.teams);

        if (data.length > 0 && !match) {
          setHomeTeamValue(data[0].id.toString());
          setAwayTeamValue(data[0].id.toString());
        } else {
          setHomeTeamValue(undefined);
          setAwayTeamValue(undefined);
        }
      } else {
        setTeams(null);
      }
      setIsTeamsLoading(false);
    }

    getLeagueTeams();
  }, [seasonId]);

  return (
    <div className="overflow-auto px-4">
      <PageHeader
        label={
          match ? "Edit League Knockout Match" : "Add League Knockout Match"
        }
      />
      {formState.success && (
        <p className="p-2 px-3 rounded-md w-full bg-emerald-500/10 text-emerald-500 text-lg mb-2 text-center flex items-center gap-2">
          <Check size={20} />
          Match has been {match == null ? "added" : "updated"} successfully
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
                match?.season.leagueId.toString() ||
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
                match?.seasonId.toString() ||
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
        {teams && teams.length > 0 && !isTeamsLoading ? (
          <FormField>
            <Label htmlFor="homeTeamId">Home Team</Label>
            <div>
              <div className="flex items-center gap-2">
                <Select
                  name="homeTeamId"
                  key={homeTeamKey}
                  defaultValue={
                    (homeTeamValue && homeTeamValue.toString()) || undefined
                  }
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
                <Button
                  type="button"
                  className="bg-secondary/50 hover:bg-primary/50 transition duration-300"
                  variant="outline"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    setHomeTeamValue(undefined);
                    setHomeTeamKey(+new Date());
                  }}
                >
                  <Eraser strokeWidth="1.5px" />
                </Button>
              </div>
            </div>
            <FormFieldError error={formState.errors?.homeTeamId} />
          </FormField>
        ) : (
          <FormFieldLoadingState
            isLoading={false}
            label=""
            notFoundText="There is no teams, add some!"
          />
        )}
        {teams && teams.length > 0 && !isTeamsLoading ? (
          <FormField>
            <Label htmlFor="awayTeamId">Away Team</Label>
            <div>
              <div className="flex items-center gap-2">
                <Select
                  name="awayTeamId"
                  key={awayTeamKey}
                  defaultValue={
                    (awayTeamValue && awayTeamValue.toString()) || undefined
                  }
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
                <Button
                  type="button"
                  className="bg-secondary/50 hover:bg-primary/50 transition duration-300"
                  variant="outline"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAwayTeamValue(undefined);
                    setAwayTeamKey(+new Date());
                  }}
                >
                  <Eraser strokeWidth="1.5px" />
                </Button>
              </div>
            </div>
            <FormFieldError error={formState.errors?.awayTeamId} />
          </FormField>
        ) : (
          <FormFieldLoadingState
            isLoading={false}
            label=""
            notFoundText="There is no teams, add some!"
          />
        )}
        <FormField>
          <Label htmlFor="homeGoals">Home Main Time Goals</Label>
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
          <Label htmlFor="awayGoals">Away Main Time Goals</Label>
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
            !leagues ||
            leagues.length <= 0 ||
            isSeasonsLoading ||
            !seasons ||
            seasons.length < 1 ||
            isTeamsLoading ||
            !teams ||
            teams.length <= 0
          }
        />
      </form>
    </div>
  );
}
