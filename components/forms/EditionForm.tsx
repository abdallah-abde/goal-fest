"use client";

import Image from "next/image";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

import { useRef, useState } from "react";

import MultipleSelector, {
  MultipleSelectorRef,
} from "@/components/ui/multiple-selector";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Eraser } from "lucide-react";

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

  // const [tournamentValue, setTournamentValue] = useState<number | undefined>(
  //   tournamentEdition?.tournamentId || undefined
  // );
  // const [tournamentKey, setTournamentKey] = useState(+new Date());

  return (
    <>
      <PageHeader
        label={
          tournamentEdition
            ? "Edit Tournament Edition"
            : "Add Tournament Edition"
        }
      />
      <form action={action} className='form-styles'>
        <FormField>
          <Label htmlFor='tournamentId'>Tournament Name</Label>
          <div>
            <div className='flex items-center gap-2'>
              <Select
                name='tournamentId'
                // value={tournamentValue}
                // key={tournamentKey}
                defaultValue={
                  (tournamentEdition?.tournamentId &&
                    tournamentEdition?.tournamentId.toString()) ||
                  tournaments[0].id.toString()
                }
              >
                <SelectTrigger className='flex-1'>
                  <SelectValue placeholder='Choose Tournament' />
                </SelectTrigger>
                <SelectContent>
                  {tournaments.map(({ id, name }) => (
                    <SelectItem value={id.toString()} key={id}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <FormFieldError error={error?.tournamentId} />
          </div>
          {/* <div>
            <select
              name='tournamentId'
              id='tournamentId'
              className='form-select'
              defaultValue={tournamentEdition?.tournamentId || undefined}
              autoFocus
            >
              {tournaments.map(({ id, name }) => (
                <option key={id} value={id} className='form-select-option'>
                  {name}
                </option>
              ))}
            </select>
            <FormFieldError error={error?.tournamentId} />
          </div> */}
        </FormField>
        <FormField>
          <Label htmlFor='year'>Year</Label>
          <Input
            // type='number'
            id='year'
            name='year'
            // required
            defaultValue={tournamentEdition?.year || undefined}
          />

          <FormFieldError error={error?.year} />
        </FormField>
        <FormField>
          <Label htmlFor='logoUrl'>Logo</Label>
          <Input type='file' id='logoUrl' name='logoUrl' />
          {tournamentEdition != null && tournamentEdition?.logoUrl != "" && (
            <div className='current-flag-wrapper'>
              <Label>Current Logo</Label>
              <Image
                src={tournamentEdition?.logoUrl || ""}
                height='100'
                width='100'
                alt='Tournament Edition Logo'
              />
              <FormFieldError error={error?.logoUrl} />
            </div>
          )}
        </FormField>
        <FormField>
          <Label htmlFor='winnerId'>Winner Team</Label>
          <div className='flex items-center gap-2'>
            <Select
              name='winnerId'
              // value={value}
              key={winnerKey}
              defaultValue={
                (winnerValue && winnerValue.toString()) || undefined
              }
            >
              <SelectTrigger className='flex-1'>
                <SelectValue placeholder='Choose Winner Team' />
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
              type='button'
              className='bg-secondary/50 hover:bg-primary/50 transition duration-300'
              variant='outline'
              size='icon'
              onClick={(e) => {
                e.stopPropagation();
                setWinnerValue(undefined);
                setWinnerKey(+new Date());
              }}
            >
              <Eraser strokeWidth='1.5px' />
            </Button>
          </div>
          {/* <div>
            <select
              name='winnerId'
              id='winnerId'
              className='form-select'
              defaultValue={tournamentEdition?.winnerId || undefined}
            >
              <option className='form-select-option' value='choose team'>
                Choose Team...
              </option>
              {teams.map(({ id, name }) => (
                <option key={id} value={id} className='form-select-option'>
                  {name}
                </option>
              ))}
            </select>
            <FormFieldError error={error?.winnerId} />
          </div> */}
        </FormField>
        <FormField>
          <Label htmlFor='titleHolderId'>Title Holder Team</Label>
          <div>
            <select
              name='titleHolderId'
              id='titleHolderId'
              className='form-select'
              defaultValue={tournamentEdition?.titleHolderId || undefined}
            >
              <option className='form-select-option' value='choose team'>
                Choose Team...
              </option>
              {teams.map(({ id, name }) => (
                <option key={id} value={id} className='form-select-option'>
                  {name}
                </option>
              ))}
            </select>
            <FormFieldError error={error?.titleHolderId} />
          </div>
        </FormField>
        <FormField>
          <Label htmlFor='hostingCountries'>Hosting Countries</Label>
          <Input
            type='hidden'
            id='hostingCountries'
            name='hostingCountries'
            value={hiddenHostingCountries}
          />
          <MultipleSelector
            className='form-multiple-selector-styles'
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
            placeholder='Select hosting countries for this tournament'
            emptyIndicator={
              <p className='empty-indicator'>No countries found</p>
            }
            value={selectedHostingCountries}
          />

          <FormFieldError error={error?.hostingCountries} />
        </FormField>
        <FormField>
          <Label htmlFor='teams'>Teams</Label>
          <Input type='hidden' id='teams' name='teams' value={hiddenTeams} />
          <MultipleSelector
            className='form-multiple-selector-styles'
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
            placeholder='Select teams you like to add to the tournament'
            emptyIndicator={<p className='empty-indicator'>No teams found.</p>}
            value={selectedTeams}
          />
          <FormFieldError error={error?.teams} />
        </FormField>
        <SubmitButton />
      </form>
    </>
  );
}
