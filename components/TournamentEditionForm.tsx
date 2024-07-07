"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormState, useFormStatus } from "react-dom";
import {
  addTournamentEdition,
  updateTournamentEdition,
} from "@/actions/tournamentsEditions";
import { TournamentEdition, Tournament } from "@prisma/client";
import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";

export default function TournamentEditionForm({
  tournamentEdition,
  tournaments,
}: {
  tournamentEdition?: TournamentEdition | null;
  tournaments: Tournament[];
}) {
  const [error, action] = useFormState(
    !tournamentEdition
      ? addTournamentEdition
      : updateTournamentEdition.bind(null, tournamentEdition.id),
    {}
  );

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(
    tournamentEdition ? tournamentEdition?.tournamentId.toString() : ""
  );

  return (
    <form action={action} className='space-y-8'>
      <div className='space-y-2'>
        <Label htmlFor='tournamentId'>Tournament Name</Label>
        <select name='tournamentId' id='tournamentId'>
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
          type='text'
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
        {tournamentEdition != null && (
          <Image
            src={tournamentEdition?.logoUrl || ""}
            height='400'
            width='400'
            alt='Tournament Edition Image'
          />
        )}
        {/* {error.image && <div className="text-destructive">{error.image}</div>} */}
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
