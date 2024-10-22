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
import { Button } from "@/components/ui/button";

import { Eraser } from "lucide-react";

import { TournamentEdition, Tournament, Team, Country } from "@prisma/client";

import { useFormState } from "react-dom";
import {
  addTournamentEdition,
  updateTournamentEdition,
} from "@/actions/editions";

import PageHeader from "@/components/PageHeader";
import SubmitButton from "@/components/forms/parts/SubmitButton";
import FormField from "@/components/forms/parts/FormField";
import FormFieldError from "@/components/forms/parts/FormFieldError";
import FormFieldLoadingState from "@/components/forms/parts/FormFieldLoadingState";

import { useRef, useState } from "react";

import MultipleSelector, {
  MultipleSelectorRef,
} from "@/components/ui/multiple-selector";

interface TournamentEditionProps extends TournamentEdition {
  hostingCountries: Country[];
  tournament: Tournament;
  teams: Team[];
}

export default function EditionForm({
  tournamentEdition,
  tournaments,
  teams,
  countries,
}: {
  tournamentEdition?: TournamentEditionProps | null;
  tournaments: Tournament[];
  teams: Team[];
  countries: Country[];
}) {
  const [error, action] = useFormState(
    tournamentEdition == null
      ? addTournamentEdition
      : updateTournamentEdition.bind(null, tournamentEdition.id),
    {}
  );

  const hostingCountriesRef = useRef<MultipleSelectorRef>(null);
  const [hiddenHostingCountries, setHiddenHostingCountries] = useState<string>(
    (tournamentEdition &&
      tournamentEdition.hostingCountries.length > 0 &&
      tournamentEdition.hostingCountries
        .map(({ id }) => {
          return id.toString();
        })
        .join(",")) ||
      ""
  );

  const teamsRef = useRef<MultipleSelectorRef>(null);
  const [hiddenTeams, setHiddenTeams] = useState<string>(
    (tournamentEdition &&
      tournamentEdition.teams.length > 0 &&
      tournamentEdition.teams
        .map(({ id }) => {
          return id.toString();
        })
        .join(",")) ||
      ""
  );

  const [selectedTeams, setSelectedTeams] = useState(
    (tournamentEdition &&
      tournamentEdition.teams.length > 0 &&
      tournamentEdition.teams.map(({ id, name }) => {
        return {
          label: name,
          value: name,
          dbValue: id.toString(),
        };
      })) ||
      undefined
  );

  const [selectedHostingCountries, setSelectedHostingCountries] = useState(
    (tournamentEdition &&
      tournamentEdition.hostingCountries.length > 0 &&
      tournamentEdition.hostingCountries.map(({ id, name }) => {
        return {
          label: name,
          value: name,
          dbValue: id.toString(),
        };
      })) ||
      undefined
  );

  const [winnerValue, setWinnerValue] = useState<number | undefined>(
    tournamentEdition?.winnerId || undefined
  );
  const [winnerKey, setWinnerKey] = useState(+new Date());

  const [titleHolderValue, setTitleHolderValue] = useState<number | undefined>(
    tournamentEdition?.titleHolderId || undefined
  );
  const [titleHolderKey, setTitleHolderKey] = useState(+new Date());

  return (
    <>
      <PageHeader
        label={
          tournamentEdition
            ? "Edit Tournament Edition"
            : "Add Tournament Edition"
        }
      />
      <form action={action} className="form-styles">
        {tournaments && tournaments.length > 0 ? (
          <FormField>
            <Label htmlFor="tournamentId">Tournament Name</Label>
            <Select
              name="tournamentId"
              defaultValue={
                (tournamentEdition?.tournamentId &&
                  tournamentEdition?.tournamentId.toString()) ||
                tournaments[0].id.toString() ||
                undefined
              }
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Choose Tournament" />
              </SelectTrigger>
              <SelectContent>
                {tournaments.map(({ id, name }) => (
                  <SelectItem value={id.toString()} key={id}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormFieldError error={error?.tournamentId} />
          </FormField>
        ) : (
          <FormFieldLoadingState
            isLoading={false}
            label=""
            notFoundText="There is no tournaments, add some!"
          />
        )}
        <FormField>
          <Label htmlFor="startYear">Start Year</Label>
          <Input
            id="startYear"
            name="startYear"
            defaultValue={tournamentEdition?.startYear || undefined}
          />
          <FormFieldError error={error?.startYear} />
        </FormField>
        <FormField>
          <Label htmlFor="endYear">End Year</Label>
          <Input
            id="endYear"
            name="endYear"
            defaultValue={tournamentEdition?.endYear || undefined}
          />
          <FormFieldError error={error?.endYear} />
        </FormField>
        <FormField>
          <Label htmlFor="logoUrl">Logo</Label>
          <Input type="file" id="logoUrl" name="logoUrl" />
          {tournamentEdition != null && tournamentEdition?.logoUrl && (
            <div className="current-flag-wrapper">
              <Label>Current Logo</Label>
              <Image
                src={tournamentEdition?.logoUrl || ""}
                height="100"
                width="100"
                alt={`${
                  (tournamentEdition &&
                    tournamentEdition.tournament &&
                    tournamentEdition.tournament.name +
                      " " +
                      tournamentEdition.year) ||
                  "Tournament Edition"
                } Logo`}
                className="w-20 h-20"
              />
              <FormFieldError error={error?.logoUrl} />
            </div>
          )}
        </FormField>
        <FormField>
          <Label htmlFor="winnerId">Winner Team</Label>
          <div>
            <div className="flex items-center gap-2">
              <Select
                name="winnerId"
                key={winnerKey}
                defaultValue={
                  (winnerValue && winnerValue.toString()) || undefined
                }
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Choose Winner Team" />
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
                  setWinnerValue(undefined);
                  setWinnerKey(+new Date());
                }}
              >
                <Eraser strokeWidth="1.5px" />
              </Button>
            </div>
            <FormFieldError error={error?.winnerId} />
          </div>
        </FormField>
        <FormField>
          <Label htmlFor="titleHolderId">Title Holder Team</Label>
          <div>
            <div className="flex items-center gap-2">
              <Select
                name="titleHolderId"
                key={titleHolderKey}
                defaultValue={
                  (titleHolderValue && titleHolderValue.toString()) || undefined
                }
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Choose Title Holder Team" />
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
                  setTitleHolderValue(undefined);
                  setTitleHolderKey(+new Date());
                }}
              >
                <Eraser strokeWidth="1.5px" />
              </Button>
            </div>
            <FormFieldError error={error?.titleHolderId} />
          </div>
        </FormField>
        <FormField>
          <Label htmlFor="hostingCountries">Hosting Countries</Label>
          <Input
            type="hidden"
            id="hostingCountries"
            name="hostingCountries"
            value={hiddenHostingCountries}
          />
          <MultipleSelector
            className="form-multiple-selector-styles"
            ref={hostingCountriesRef}
            defaultOptions={countries.map(({ id, name }) => {
              return {
                label: name,
                value: name,
                dbValue: id.toString(),
              };
            })}
            onChange={(options) => {
              setHiddenHostingCountries(
                options
                  .map((a) => {
                    return a.dbValue;
                  })
                  .join(",")
              );
            }}
            placeholder="Select hosting countries for this tournament"
            emptyIndicator={
              <p className="empty-indicator">No countries found</p>
            }
            value={selectedHostingCountries}
          />
          <FormFieldError error={error?.hostingCountries} />
        </FormField>
        <FormField>
          <Label htmlFor="teams">Teams</Label>
          <Input type="hidden" id="teams" name="teams" value={hiddenTeams} />
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
            placeholder="Select teams you like to add to the tournament"
            emptyIndicator={<p className="empty-indicator">No teams found.</p>}
            value={selectedTeams}
          />
          <FormFieldError error={error?.teams} />
        </FormField>
        <SubmitButton isDisabled={!tournaments || tournaments.length <= 0} />
      </form>
    </>
  );
}
