"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormState, useFormStatus } from "react-dom";
import {
  addTournamentGroup,
  updateTournamentGroup,
} from "@/actions/tournamentsGroups";
import { Group } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";

export default function TournamentGroupForm({
  group,
}: {
  group?: Group | null;
}) {
  const params = useParams();
  const [error, action] = useFormState(
    !group ? addTournamentGroup : updateTournamentGroup.bind(null, group.id),
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
          defaultValue={group?.name || ""}
        />
        {/* {error?.message && <div className='text-destructive'>{error?.message}</div>} */}
      </div>
      <Input
        type='hidden'
        id='tournamentEditionId'
        name='tournamentEditionId'
        defaultValue={params.id}
      />
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
