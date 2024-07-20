"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormState, useFormStatus } from "react-dom";
import { addTournament, updateTournament } from "@/actions/tournaments";
import { Tournament } from "@prisma/client";
import Image from "next/image";

export default function TournamentForm({
  tournament,
}: {
  tournament?: Tournament | null;
}) {
  const [error, action] = useFormState(
    !tournament ? addTournament : updateTournament.bind(null, tournament.id),
    {}
  );

  return (
    <form action={action} className='space-y-8'>
      <div className='space-y-2'>
        <Label htmlFor='name'>Name</Label>
        <Input
          type='text'
          id='name'
          name='name'
          required
          defaultValue={tournament?.name || ""}
        />
        {/* {error?.message && <div className='text-destructive'>{error?.message}</div>} */}
      </div>
      <div className='space-y-2'>
        <Label htmlFor='image'>Image</Label>
        <Input
          type='file'
          id='image'
          name='image'
          required={tournament === null}
        />
      </div>

      {tournament != null && tournament?.logoUrl !== null && (
        <div className='space-y-2'>
          <Label>Current Image</Label>
          <Image
            src={tournament?.logoUrl || ""}
            height='100'
            width='100'
            alt='Tournament Image'
          />

          {/* {error.image && <div className="text-destructive">{error.image}</div>} */}
        </div>
      )}
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
