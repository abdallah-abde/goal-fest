"use client";

import Image from "next/image";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { TournamentEdition, Tournament, Team, Country } from "@prisma/client";

import { useFormState } from "react-dom";
import {
  addTournamentEdition,
  updateTournamentEdition,
} from "@/actions/tournamentsEditions";

import PageHeader from "@/components/PageHeader";
import SubmitButton from "@/components/forms/SubmitButton";

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
        .map((a) => {
          return a.id.toString();
        })
        .join(",")) ||
      ""
  );

  const teamsRef = useRef<MultipleSelectorRef>(null);
  const [hiddenTeams, setHiddenTeams] = useState<string>(
    (tournamentEdition &&
      tournamentEdition.teams.length > 0 &&
      tournamentEdition.teams
        .map((a) => {
          return a.id.toString();
        })
        .join(",")) ||
      ""
  );

  const [selectedTeams, setSelectedTeams] = useState(
    (tournamentEdition &&
      tournamentEdition.teams.length > 0 &&
      tournamentEdition.teams.map((a) => {
        return {
          label: a.name,
          value: a.name,
          dbValue: a.id.toString(),
        };
      })) ||
      undefined
  );

  const [selectedHostingCountries, setSelectedHostingCountries] = useState(
    (tournamentEdition &&
      tournamentEdition.hostingCountries.length > 0 &&
      tournamentEdition.hostingCountries.map((a) => {
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
      <PageHeader
        label={
          tournamentEdition
            ? "Edit Tournament Edition"
            : "Add Tournament Edition"
        }
      />
      <form
        action={action}
        className='space-y-8 lg:space-y-0 lg:grid grid-cols-2 gap-4'
      >
        <div className='space-y-2'>
          <Label htmlFor='tournamentId'>Tournament Name</Label>
          <div>
            <select
              name='tournamentId'
              id='tournamentId'
              className='p-2 rounded-md w-full'
              defaultValue={
                tournamentEdition?.tournamentId.toString() || undefined
              }
            >
              {tournaments.map((tor) => (
                <option key={tor.id} value={tor.id}>
                  {tor.name}
                </option>
              ))}
            </select>
            {error.tournamentId && (
              <div className='text-destructive'>{error.tournamentId}</div>
            )}
          </div>
        </div>
        <div className='space-y-2'>
          <Label htmlFor='year'>Year</Label>
          <Input
            type='number'
            id='year'
            name='year'
            required
            defaultValue={tournamentEdition?.year.toString() || ""}
          />
          {error?.year && <div className='text-destructive'>{error?.year}</div>}
        </div>
        <div className='space-y-2'>
          <Label htmlFor='logoUrl'>Logo</Label>
          <Input type='file' id='logoUrl' name='logoUrl' />
          {tournamentEdition != null && tournamentEdition?.logoUrl != "" && (
            <div className='space-y-2 pt-2'>
              <Label>Current Logo</Label>
              <Image
                src={tournamentEdition?.logoUrl || ""}
                height='100'
                width='100'
                alt='Tournament Edition Logo'
              />
              {error.logoUrl && (
                <div className='text-destructive'>{error.logoUrl}</div>
              )}
            </div>
          )}
        </div>
        <div className='space-y-2'>
          <Label htmlFor='winnerId'>Winner Team</Label>
          <div>
            <select
              name='winnerId'
              id='winnerId'
              className='p-2 rounded-md w-full'
              defaultValue={tournamentEdition?.winnerId || undefined}
            >
              <option value='choose team'>Choose Team...</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
            {error.winnerId && (
              <div className='text-destructive'>{error.winnerId}</div>
            )}
          </div>
        </div>
        <div className='space-y-2 '>
          <Label htmlFor='titleHolderId'>Title Holder Team</Label>
          <div>
            <select
              name='titleHolderId'
              id='titleHolderId'
              className='p-2 rounded-md w-full'
              defaultValue={tournamentEdition?.titleHolderId || undefined}
            >
              <option value='choose team'>Choose Team...</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
            {error.titleHolderId && (
              <div className='text-destructive'>{error.titleHolderId}</div>
            )}
          </div>
        </div>
        <div className='space-y-2 '>
          <Label htmlFor='hostingCountries'>Hosting Countries</Label>
          <Input
            type='hidden'
            id='hostingCountries'
            name='hostingCountries'
            value={hiddenHostingCountries}
          />
          <MultipleSelector
            className='dark:border-1 dark:border-primary'
            ref={hostingCountriesRef}
            defaultOptions={countries.map((t) => {
              return {
                label: t.name,
                value: t.name,
                dbValue: t.id.toString(),
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
              <p className='text-center text-lg leading-10 text-gray-600 dark:text-gray-400'>
                no countries found.
              </p>
            }
            value={selectedHostingCountries}
          />
          {/* <select name='hostingCountries' id='hostingCountries' multiple={true}>
          {countries?.map((c) => (
            <option
              key={c.id}
              value={c.id}
              selected={
                tournamentEdition?.hostingCountries.filter((a) => c.id === a.id)
                  .length === 1
              }
            >
              {c.name}
            </option>
          ))}
        </select> */}
          {error?.hostingCountries && (
            <div className='text-destructive'>{error?.hostingCountries}</div>
          )}
        </div>
        <div className='space-y-2 '>
          <Label htmlFor='teams'>Teams</Label>
          <Input type='hidden' id='teams' name='teams' value={hiddenTeams} />
          <MultipleSelector
            className='dark:border-1 dark:border-primary'
            ref={teamsRef}
            defaultOptions={teams.map((t) => {
              return {
                label: t.name,
                value: t.name,
                dbValue: t.id.toString(),
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
            emptyIndicator={
              <p className='text-center text-lg leading-10 text-gray-600 dark:text-gray-400'>
                no teams found.
              </p>
            }
            value={selectedTeams}
          />
          {error?.teams && (
            <div className='text-destructive'>{error?.teams}</div>
          )}
        </div>
        <div className='col-span-2'>
          <SubmitButton />
        </div>
      </form>
    </>
  );
}
