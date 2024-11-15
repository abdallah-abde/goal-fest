"use client";

import Image from "next/image";

import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { TournamentEdition, Tournament, Team, Country } from "@prisma/client";

import {
  addTournamentEdition,
  updateTournamentEdition,
} from "@/actions/editions";

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

interface TournamentEditionProps extends TournamentEdition {
  hostingCountries: Country[];
  tournament: Tournament;
  winner: Team | null;
  titleHolder: Team | null;
  teams: Team[];
}

export default function EditionForm({
  tournamentEdition,
}: {
  tournamentEdition?: TournamentEditionProps | null;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  const [formState, formAction] = useFormState(
    tournamentEdition == null
      ? addTournamentEdition
      : updateTournamentEdition.bind(null, tournamentEdition.id),
    { errors: undefined, success: false, customError: null }
  );

  useEffect(() => {
    if (formState.success) {
      formRef.current?.reset();
      if (tournamentEdition == null) {
        setSelectedTeams([]);
        setTeamsKey(+new Date());
      }
    }
  }, [formState]);

  const [selectedTournament, setSelectedTournament] = useState<Option[]>(
    tournamentEdition
      ? [
          {
            dbValue: tournamentEdition.tournamentId.toString(),
            label: `${tournamentEdition.tournament.name} (${tournamentEdition.tournament.type})`,
            value: `${tournamentEdition.tournament.name} (${tournamentEdition.tournament.type})`,
          },
        ]
      : []
  );

  const searchTournament = async (value: string): Promise<Option[]> => {
    return new Promise(async (resolve) => {
      const res = await fetch("/api/tournaments/" + value);
      const data = await res.json();
      resolve(data);
    });
  };

  const [teams, setTeams] = useState<Team[] | null>(null);

  const [isTeamsLoading, setIsTeamsLoading] = useState(false);

  useEffect(() => {
    async function getTeams() {
      setIsTeamsLoading(true);

      if (selectedTournament.length > 0) {
        const res = await fetch(
          "/api/edition-teams/" + selectedTournament[0].dbValue
        );
        const data = await res.json();

        setTeams(data);
      } else {
        setTeams([]);
      }
      setIsTeamsLoading(false);
    }

    getTeams();
  }, [selectedTournament]);

  const teamsRef = useRef<MultipleSelectorRef>(null);
  const [teamsKey, setTeamsKey] = useState(+new Date());

  const [selectedTeams, setSelectedTeams] = useState<Option[]>(
    tournamentEdition
      ? tournamentEdition.teams.map(({ id, name }) => {
          return {
            label: name,
            value: name,
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

      if (selectedTournament.length > 0) {
        const res = await fetch(
          "/api/edition-countries/" + selectedTournament[0].dbValue
        );
        const data = await res.json();

        setCountries(data);
      } else {
        setCountries([]);
      }
      setIsCountriesLoading(false);
    }

    getCountries();
  }, [selectedTournament]);

  const countriesRef = useRef<MultipleSelectorRef>(null);
  const [countriesKey, setCountriesKey] = useState(+new Date());

  const [selectedCountries, setSelectedCountries] = useState<Option[]>(
    tournamentEdition
      ? tournamentEdition.hostingCountries.map(({ id, name }) => {
          return {
            label: name,
            value: name,
            dbValue: id.toString(),
          };
        })
      : []
  );

  const [selectedWinner, setSelectedWinner] = useState<Option[]>(
    tournamentEdition && tournamentEdition.winnerId
      ? [
          {
            dbValue: tournamentEdition.winnerId.toString(),
            label: `${tournamentEdition.winner?.name}`,
            value: `${tournamentEdition.winner?.name}`,
          },
        ]
      : []
  );

  const [selectedTitleHolder, setSelectedTitleHolder] = useState<Option[]>(
    tournamentEdition && tournamentEdition.titleHolderId
      ? [
          {
            dbValue: tournamentEdition.titleHolderId.toString(),
            label: `${tournamentEdition.titleHolder?.name}`,
            value: `${tournamentEdition.titleHolder?.name}`,
          },
        ]
      : []
  );

  const searchTeam = async (value: string): Promise<Option[]> => {
    return new Promise(async (resolve) => {
      const res = await fetch(
        `/api/teams/${selectedTournament[0].dbValue}/${value}`
      );
      const data = await res.json();
      resolve(data);
    });
  };

  return (
    <div className="overflow-auto px-4">
      <PageHeader
        label={
          tournamentEdition
            ? "Edit Tournament Edition"
            : "Add Tournament Edition"
        }
      />

      {formState.success && (
        <p className="p-2 px-3 rounded-md w-full bg-emerald-500/10 text-emerald-500 text-lg mb-2 text-center flex items-center gap-2">
          <Check size={20} />
          Edition has been {tournamentEdition == null
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
          <Label htmlFor="tournamentId">Tournament</Label>
          <Input
            type="hidden"
            id="tournamentId"
            name="tournamentId"
            value={selectedTournament[0]?.dbValue || ""}
          />
          <MultipleSelector
            className="form-multiple-selector-styles"
            hideClearAllButton
            hidePlaceholderWhenSelected
            badgeClassName="text-primary"
            onSearch={async (value) => {
              const res = await searchTournament(value);
              return res;
            }}
            maxSelected={1}
            placeholder="Select tournament"
            emptyIndicator={
              <p className="empty-indicator">No tournaments found.</p>
            }
            loadingIndicator={
              <p className="py-2 text-center text-lg leading-10 text-muted-foreground">
                Loading...
              </p>
            }
            onChange={setSelectedTournament}
            value={selectedTournament}
            disabled={!!tournamentEdition}
          />
          <FormFieldError error={formState.errors?.tournamentId} />
        </FormField>

        <FormField>
          <Label htmlFor="startYear">Start Year</Label>
          <Input
            id="startYear"
            name="startYear"
            defaultValue={tournamentEdition?.startYear || undefined}
          />
          <FormFieldError error={formState.errors?.startYear} />
        </FormField>
        <FormField>
          <Label htmlFor="endYear">End Year</Label>
          <Input
            id="endYear"
            name="endYear"
            defaultValue={tournamentEdition?.endYear || undefined}
          />
          <FormFieldError error={formState.errors?.endYear} />
        </FormField>
        <FormField>
          <Label htmlFor="logoUrl">Logo</Label>
          <Input type="file" id="logoUrl" name="logoUrl" />
          {tournamentEdition != null && tournamentEdition?.logoUrl && (
            <div className="current-flag-wrapper">
              <Label>Current Logo</Label>
              <Image
                src={tournamentEdition?.logoUrl || ""}
                height={150}
                width={150}
                alt={`${
                  (tournamentEdition &&
                    tournamentEdition.tournament &&
                    tournamentEdition.tournament.name +
                      " " +
                      tournamentEdition.year) ||
                  "Tournament Edition"
                } Logo`}
                className="aspect-video object-contain"
              />
              <FormFieldError error={formState.errors?.logoUrl} />
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
            className="form-multiple-selector-styles"
            hideClearAllButton
            hidePlaceholderWhenSelected
            badgeClassName="text-primary"
            onSearch={async (value) => {
              const res = await searchTeam(value);
              return res;
            }}
            maxSelected={1}
            placeholder="Select team"
            emptyIndicator={<p className="empty-indicator">No teams found.</p>}
            loadingIndicator={
              <p className="py-2 text-center text-lg leading-10 text-muted-foreground">
                Loading...
              </p>
            }
            onChange={setSelectedWinner}
            value={selectedWinner}
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
            className="form-multiple-selector-styles"
            hideClearAllButton
            hidePlaceholderWhenSelected
            badgeClassName="text-primary"
            onSearch={async (value) => {
              const res = await searchTeam(value);
              return res;
            }}
            maxSelected={1}
            placeholder="Select team"
            emptyIndicator={<p className="empty-indicator">No teams found.</p>}
            loadingIndicator={
              <p className="py-2 text-center text-lg leading-10 text-muted-foreground">
                Loading...
              </p>
            }
            onChange={setSelectedTitleHolder}
            value={selectedTitleHolder}
          />
          <FormFieldError error={formState.errors?.titleHolderId} />
        </FormField>

        {countries && countries.length > 0 && !isCountriesLoading ? (
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
              className="form-multiple-selector-styles"
              ref={countriesRef}
              key={countriesKey}
              defaultOptions={countries.map(({ id, name }) => {
                return {
                  label: name,
                  value: name,
                  dbValue: id.toString(),
                };
              })}
              placeholder="Select countries"
              emptyIndicator={
                <p className="empty-indicator">No countries found.</p>
              }
              loadingIndicator={
                <p className="py-2 text-center text-lg leading-10 text-muted-foreground">
                  Loading...
                </p>
              }
              onChange={setSelectedCountries}
              value={selectedCountries}
            />
            <FormFieldError error={formState.errors?.hostingCountries} />
          </FormField>
        ) : (
          <FormFieldLoadingState
            isLoading={isCountriesLoading}
            label="Loading Countries..."
            notFoundText="There is no countries, add some!"
          />
        )}

        {teams && teams.length > 0 && !isTeamsLoading ? (
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
                <p className="empty-indicator">No teams found.</p>
              }
              loadingIndicator={
                <p className="py-2 text-center text-lg leading-10 text-muted-foreground">
                  Loading...
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
          isDisabled={
            selectedTournament.length === 0 ||
            isTeamsLoading ||
            isCountriesLoading
          }
        />
      </form>
    </div>
  );
}
