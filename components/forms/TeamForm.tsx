"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useFormState, useFormStatus } from "react-dom";
import { addTeam, updateTeam } from "@/actions/teams";

import { Team } from "@prisma/client";

export default function TeamForm({ team }: { team?: Team | null }) {
  const [error, action] = useFormState(
    !team ? addTeam : updateTeam.bind(null, team.id),
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
          defaultValue={team?.name || ""}
        />
        {/* {error?.message && <div className='text-destructive'>{error?.message}</div>} */}
      </div>
      <div className='space-y-2'>
        <Label htmlFor='image'>Image</Label>
        <Input type='file' id='image' name='image' required={team === null} />
      </div>
      {team != null && team?.flagUrl !== null && (
        <div className='space-y-2'>
          <Label>Current Image</Label>
          <Image
            src={team?.flagUrl || ""}
            height='100'
            width='100'
            alt='Team Image'
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
    <Button type='submit' disabled={pending} className='font-bold'>
      {pending ? "Saving..." : "Save"}
    </Button>
  );
}
