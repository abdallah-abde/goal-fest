"use client";

import Image from "next/image";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Tournament } from "@prisma/client";

import { useFormState } from "react-dom";
import { addTournament, updateTournament } from "@/actions/tournaments";

import PageHeader from "@/components/PageHeader";
import SubmitButton from "@/components/forms/parts/SubmitButton";
import FormField from "@/components/forms/parts/FormField";
import FormFieldError from "@/components/forms/parts/FormFieldError";

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
      <form action={action} className='form-styles'>
        <FormField>
          <Label htmlFor='name'>Name</Label>
          <Input
            type='text'
            id='name'
            name='name'
            // required
            defaultValue={tournament?.name || ""}
            autoFocus
          />
          <FormFieldError error={error?.name} />
        </FormField>
        <FormField>
          <Label htmlFor='logoUrl'>Logo</Label>
          <Input type='file' id='logoUrl' name='logoUrl' />
          {tournament != null && tournament?.logoUrl != "" && (
            <div className='current-flag-wrapper'>
              <Image
                src={tournament?.logoUrl || ""}
                height='100'
                width='100'
                alt='Tournament Logo'
              />
              <FormFieldError error={error?.logoUrl} />
            </div>
          )}
        </FormField>
        <SubmitButton />
      </form>
    </>
  );
}
