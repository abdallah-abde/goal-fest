"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useFormState, useFormStatus } from "react-dom";
import {
  addTournamentEdition,
  updateTournamentEdition,
} from "@/actions/tournamentsEditions";

import { TournamentEdition, Tournament, Team, Country } from "@prisma/client";
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
    !tournamentEdition
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
    <form action={action} className='space-y-8'>
      <div className='space-y-2 flex flex-col gap-1'>
        <Label htmlFor='tournamentId'>Tournament Name</Label>
        <select
          name='tournamentId'
          id='tournamentId'
          className='p-2 rounded-md'
          defaultValue={tournamentEdition?.tournamentId.toString() || undefined}
        >
          {tournaments.map((tor) => (
            <option key={tor.id} value={tor.id}>
              {tor.name}
            </option>
          ))}
        </select>
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
        {/* {error?.message && <div className='text-destructive'>{error?.message}</div>} */}
      </div>
      <div className='space-y-2'>
        <Label htmlFor='image'>Image</Label>
        <Input
          type='file'
          id='image'
          name='image'
          required={tournamentEdition === null}
        />
      </div>
      {tournamentEdition != null && tournamentEdition?.logoUrl != null && (
        <div className='space-y-2'>
          <Label>Current Image</Label>
          <Image
            src={tournamentEdition?.logoUrl || ""}
            height='100'
            width='100'
            alt={
              tournamentEdition?.tournament.name +
                " " +
                tournamentEdition?.year.toString() || ""
            }
          />
          {/* {error.image && <div className="text-destructive">{error.image}</div>} */}
        </div>
      )}
      <div className='space-y-2 flex flex-col gap-1'>
        <Label htmlFor='winnerId'>Winner Team</Label>
        <select
          name='winnerId'
          id='winnerId'
          className='p-2 rounded-md'
          defaultValue={tournamentEdition?.winnerId || undefined}
        >
          <option value='choose team'>Choose Team...</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>
      <div className='space-y-2 flex flex-col gap-1'>
        <Label htmlFor='titleHolderId'>Title Holder Team</Label>
        <select
          name='titleHolderId'
          id='titleHolderId'
          className='p-2 rounded-md'
          defaultValue={tournamentEdition?.titleHolderId || undefined}
        >
          <option value='choose team'>Choose Team...</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>
      <div className='space-y-2 flex flex-col gap-1'>
        <Label htmlFor='hostingCountries'>Hosting Countries</Label>
        <Input
          type='hidden'
          id='hostingCountries'
          name='hostingCountries'
          value={hiddenHostingCountries}
        />
        <MultipleSelector
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
        {/* {error?.message && <div className='text-destructive'>{error?.message}</div>} */}
      </div>
      <div className='space-y-2 flex flex-col gap-1'>
        <Label htmlFor='teams'>Teams</Label>
        <Input type='hidden' id='teams' name='teams' value={hiddenTeams} />
        <MultipleSelector
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
        {/* {error?.message && <div className='text-destructive'>{error?.message}</div>} */}
      </div>
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type='submit' disabled={pending}>
      {pending ? "Saving..." : "Save"}
    </Button>
  );
}
