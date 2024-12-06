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
import { Button } from "@/components/ui/button";

import {
  KnockoutMatch,
  Team,
  Tournament,
  TournamentEdition,
} from "@prisma/client";

import {
  addTournamentKnockoutMatch,
  updateTournamentKnockoutMatch,
} from "@/actions/knockoutMatches";

import PageHeader from "@/components/PageHeader";
import { MultipleSelectorLoadingIndicator } from "@/components/Skeletons";
import SubmitButton from "@/components/forms/parts/SubmitButton";
import FormField from "@/components/forms/parts/FormField";
import FormFieldError from "@/components/forms/parts/FormFieldError";
import FormFieldLoadingState from "@/components/forms/parts/FormFieldLoadingState";
import FormSuccessMessage from "@/components/forms/parts/FormSuccessMessage";
import FormCustomErrorMessage from "@/components/forms/parts/FormCustomErrorMessage";
import MultipleSelectorEmptyIndicator from "@/components/forms/parts/MultipleSelectorEmptyIndicator";

import { Eraser } from "lucide-react";

import MultipleSelector, {
  MultipleSelectorRef,
  Option,
} from "@/components/ui/multiple-selector";

import { getDateValueForDateTimeInput } from "@/lib/getFormattedDate";
import { searchTournament, searchEdition } from "@/lib/api-functions";

interface MatchProps extends KnockoutMatch {
  tournamentEdition: TournamentEditionProps;
  homeTeam: Team | null;
  awayTeam: Team | null;
}

interface TournamentEditionProps extends TournamentEdition {
  tournament: Tournament;
}

export default function KnockoutMatchForm({
  match,
}: {
  match?: MatchProps | null;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  const [formState, formAction] = useFormState(
    match == null
      ? addTournamentKnockoutMatch
      : updateTournamentKnockoutMatch.bind(null, match.id),
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

  const [selectedTournament, setSelectedTournament] = useState<Option[]>(
    match
      ? [
          {
            dbValue: match.tournamentEdition.tournamentId.toString(),
            label: `${match.tournamentEdition.tournament.name} (${match.tournamentEdition.tournament.type})`,
            value: `${match.tournamentEdition.tournament.name} (${match.tournamentEdition.tournament.type})`,
          },
        ]
      : []
  );

  useEffect(() => {
    if (match == null) {
      setSelectedEdition([]);
      setEditionsKey(+new Date());
    }
  }, [selectedTournament, match]);

  const [selectedEdition, setSelectedEdition] = useState<Option[]>(
    match
      ? [
          {
            dbValue: match?.tournamentEditionId.toString(),
            label: `${match?.tournamentEdition.tournament.name} ${match?.tournamentEdition.year}`,
            value: `${match?.tournamentEdition.tournament.name} ${match?.tournamentEdition.year}`,
          },
        ]
      : []
  );

  const [editionsKey, setEditionsKey] = useState(+new Date());

  const editionsRef = useRef<MultipleSelectorRef>(null);

  const [teams, setTeams] = useState<Team[] | null>(null);

  const [isTeamsLoading, setIsTeamsLoading] = useState(false);

  useEffect(() => {
    async function getTeams() {
      setIsTeamsLoading(true);

      if (selectedEdition.length > 0) {
        const res = await fetch(
          "/api/editions-teams/" + selectedEdition[0].dbValue
        );
        const data = await res.json();

        setTeams(data.teams);
      } else {
        setTeams([]);
      }
      setIsTeamsLoading(false);
    }

    getTeams();
  }, [selectedEdition]);

  const [homeTeamValue, setHomeTeamValue] = useState<string | undefined>(
    match?.homeTeamId?.toString() || undefined
  );

  const [homeTeamKey, setHomeTeamKey] = useState(+new Date());

  const [awayTeamValue, setAwayTeamValue] = useState<string | undefined>(
    match?.awayTeamId?.toString() || undefined
  );

  const [awayTeamKey, setAwayTeamKey] = useState(+new Date());

  return (
    <div className="overflow-auto px-4">
      <PageHeader
        label={match ? "Edit Knockout Match" : "Add Knockout Match"}
      />

      <FormSuccessMessage
        success={formState.success}
        message={`Match has been ${
          match == null ? "added" : "updated"
        } successfully`}
      />

      <FormCustomErrorMessage customError={formState.customError} />

      <form action={formAction} className="form-styles" ref={formRef}>
        <FormField>
          <Label htmlFor="tournamentId">Tournament</Label>
          <Input
            type="hidden"
            id="tournamentId"
            name="tournamentId"
            value={selectedTournament[0]?.dbValue || ""}
          />
          <MultipleSelector
            className="form-multiple-selector-styles"
            hidePlaceholderWhenSelected
            hideClearAllButton
            badgeClassName="text-primary"
            onSearch={async (value) => {
              const res = await searchTournament(value);
              return res;
            }}
            maxSelected={1}
            placeholder="Select tournament"
            emptyIndicator={
              <MultipleSelectorEmptyIndicator label="No tournaments found" />
            }
            loadingIndicator={<MultipleSelectorLoadingIndicator />}
            onChange={setSelectedTournament}
            value={selectedTournament}
            disabled={!!match}
          />
        </FormField>

        <FormField>
          <Label htmlFor="tournamentEditionId">Edition</Label>
          <Input
            type="hidden"
            id="tournamentEditionId"
            name="tournamentEditionId"
            value={selectedEdition[0]?.dbValue || ""}
          />
          <MultipleSelector
            className="form-multiple-selector-styles"
            hidePlaceholderWhenSelected
            hideClearAllButton
            badgeClassName="text-primary"
            key={editionsKey}
            onSearch={async (value) => {
              const res = await searchEdition(
                value,
                selectedTournament[0].dbValue
              );
              return res;
            }}
            maxSelected={1}
            placeholder="Select edition"
            emptyIndicator={
              <MultipleSelectorEmptyIndicator label="No editions found" />
            }
            loadingIndicator={<MultipleSelectorLoadingIndicator />}
            ref={editionsRef}
            onChange={setSelectedEdition}
            value={selectedEdition}
            disabled={!!match || selectedTournament.length === 0}
          />
        </FormField>

        {teams && teams.length > 0 && !isTeamsLoading ? (
          <FormField>
            <Label htmlFor="homeTeamId">Home Team</Label>
            <div>
              <div className="flex items-center gap-2">
                <Select
                  name="homeTeamId"
                  key={homeTeamKey}
                  defaultValue={homeTeamValue}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Choose Home Team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map(({ id, name }) => (
                      <SelectItem value={id.toString()} key={id}>
                        {name}
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
                  defaultValue={awayTeamValue}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Choose Away Team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map(({ id, name }) => (
                      <SelectItem value={id.toString()} key={id}>
                        {name}
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
            selectedTournament.length === 0 ||
            selectedEdition.length === 0 ||
            isTeamsLoading
          }
        />
      </form>
    </div>
  );
}
