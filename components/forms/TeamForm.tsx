"use client";

import Image from "next/image";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Team } from "@prisma/client";

import { useFormState } from "react-dom";
import { addTeam, updateTeam } from "@/actions/teams";

import PageHeader from "@/components/PageHeader";
import SubmitButton from "@/components/forms/parts/SubmitButton";
import FormField from "@/components/forms/parts/FormField";
import FormFieldError from "@/components/forms/parts/FormFieldError";

export default function TeamForm({ team }: { team?: Team | null }) {
  const [error, action] = useFormState(
    team == null ? addTeam : updateTeam.bind(null, team.id),
    {}
  );

  return (
    <>
      <PageHeader label={team ? "Edit Team" : "Add Team"} />
      <form action={action} className='form-styles'>
        <FormField>
          <Label htmlFor='name'>Name</Label>
          <Input
            type='text'
            id='name'
            name='name'
            // required
            defaultValue={team?.name || ""}
            autoFocus
          />
          <FormFieldError error={error?.name} />
        </FormField>
        <FormField>
          <Label htmlFor='code'>Team Code</Label>
          <Input
            type='text'
            id='code'
            name='code'
            // required
            defaultValue={team?.code || ""}
          />
          <FormFieldError error={error?.code} />
        </FormField>
        <FormField>
          <Label htmlFor='flagUrl'>Flag</Label>
          <Input type='file' id='flagUrl' name='flagUrl' />
          {team != null && team?.flagUrl != "" && (
            <div className='current-flag-wrapper'>
              <Label>Current Flag</Label>
              <Image
                src={team?.flagUrl || ""}
                height='100'
                width='100'
                alt='Team Flag'
              />
              <FormFieldError error={error?.flagUrl} />
            </div>
          )}
        </FormField>
        <SubmitButton />
      </form>
    </>
  );
}
