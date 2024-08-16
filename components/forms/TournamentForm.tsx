"use client";

import Image from "next/image";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Tournament } from "@prisma/client";

import { useFormState } from "react-dom";
import { addTournament, updateTournament } from "@/actions/tournaments";

import PageHeader from "@/components/PageHeader";
import SubmitButton from "@/components/forms/SubmitButton";

export default function TournamentForm({
  tournament,
}: {
  tournament?: Tournament | null;
}) {
  const [error, action] = useFormState(
    tournament == null
      ? addTournament
      : updateTournament.bind(null, tournament.id),
    {}
  );

  return (
    <>
      <PageHeader label={tournament ? "Edit Tournament" : "Add Tournament"} />
      <form
        action={action}
        className='space-y-8 lg:space-y-0 lg:grid grid-cols-2 gap-4'
      >
        <div className='space-y-2'>
          <Label htmlFor='name'>Name</Label>
          <Input
            type='text'
            id='name'
            name='name'
            required
            defaultValue={tournament?.name || ""}
          />
          {error?.name && <div className='text-destructive'>{error?.name}</div>}
        </div>
        <div className='space-y-2'>
          <Label htmlFor='logoUrl'>Logo</Label>
          <Input type='file' id='logoUrl' name='logoUrl' />
          {tournament != null && tournament?.logoUrl != "" && (
            <div className='space-y-2 pt-2'>
              <Label>Current Logo</Label>
              <Image
                src={tournament?.logoUrl || ""}
                height='100'
                width='100'
                alt='Tournament Logo'
              />

              {error.logoUrl && (
                <div className='text-destructive'>{error.logoUrl}</div>
              )}
            </div>
          )}
        </div>
        <div className='col-span-2'>
          <SubmitButton />
        </div>
      </form>
    </>
  );
}
