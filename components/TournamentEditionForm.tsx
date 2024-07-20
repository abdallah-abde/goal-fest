"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormState, useFormStatus } from "react-dom";
import {
  addTournamentEdition,
  updateTournamentEdition,
} from "@/actions/tournamentsEditions";
import { TournamentEdition, Tournament, Team, Country } from "@prisma/client";
import Image from "next/image";

interface TournamentEditionProps extends TournamentEdition {
  hostingCountries: Country[];
}

export default function TournamentEditionForm({
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

  return (
    <form action={action} className='space-y-8'>
      <div className='space-y-2 flex flex-col gap-1'>
        <Label htmlFor='tournamentId'>Tournament Name</Label>
        <select
          name='tournamentId'
          id='tournamentId'
          className='p-2 rounded-md'
        >
          {tournaments.map((t) => (
            <option
              value={t.id}
              selected={t.id === tournamentEdition?.tournamentId}
            >
              {t.name}
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
            alt='Tournament Edition Image'
          />
          {/* {error.image && <div className="text-destructive">{error.image}</div>} */}
        </div>
      )}
      <div className='space-y-2 flex flex-col gap-1'>
        <Label htmlFor='winnerId'>Winner Team</Label>
        <select name='winnerId' id='winnerId' className='p-2 rounded-md'>
          <option value='choose team'>Choose Team...</option>
          {teams.map((t) => (
            <option
              key={t.id}
              value={t.id}
              selected={t.id === tournamentEdition?.winnerId}
            >
              {t.name}
            </option>
          ))}
        </select>
      </div>
      <div className='space-y-2 flex flex-col gap-1'>
        <Label htmlFor='hostingCountries'>Hosting Countries</Label>
        <select name='hostingCountries' id='hostingCountries' multiple={true}>
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
        </select>
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
