"use client";

import Image from "next/image";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useFormState, useFormStatus } from "react-dom";
import { addTeam, updateTeam } from "@/actions/teams";

import { Team } from "@prisma/client";
import PageHeader from "@/components/PageHeader";
import SubmitButton from "@/components/forms/SubmitButton";

export default function TeamForm({ team }: { team?: Team | null }) {
  const [error, action] = useFormState(
    team == null ? addTeam : updateTeam.bind(null, team.id),
    {}
  );

  return (
    <>
      <PageHeader label={team ? "Edit Team" : "Add Team"} />
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
            defaultValue={team?.name || ""}
          />
          {error?.name && <div className='text-destructive'>{error?.name}</div>}
        </div>
        <div className='space-y-2'>
          <Label htmlFor='flagUrl'>Flag</Label>
          <Input type='file' id='flagUrl' name='flagUrl' />
          {team != null && team?.flagUrl != "" && (
            <div className='space-y-2 pt-2'>
              <Label>Current Flag</Label>
              <Image
                src={team?.flagUrl || ""}
                height='100'
                width='100'
                alt='Team Flag'
              />
              {error.flagUrl && (
                <div className='text-destructive'>{error.flagUrl}</div>
              )}
            </div>
          )}
        </div>
        <SubmitButton />
      </form>
    </>
  );
}
