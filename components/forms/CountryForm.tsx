"use client";

import Image from "next/image";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Country } from "@prisma/client";

import { useFormState } from "react-dom";
import { addCountry, updateCountry } from "@/actions/countries";

import PageHeader from "@/components/PageHeader";
import SubmitButton from "@/components/forms/parts/SubmitButton";
import FormField from "@/components/forms/parts/FormField";
import FormFieldError from "@/components/forms/parts/FormFieldError";

export default function CountryForm({ country }: { country?: Country | null }) {
  const [error, action] = useFormState(
    country == null ? addCountry : updateCountry.bind(null, country.id),
    {}
  );

  return (
    <>
      <PageHeader label={country ? "Edit Country" : "Add Country"} />
      <form action={action} className='form-styles'>
        <FormField>
          <Label htmlFor='name'>Name</Label>
          <Input
            type='text'
            id='name'
            name='name'
            // required
            defaultValue={country?.name || ""}
            autoFocus
          />
          <FormFieldError error={error?.name} />
        </FormField>
        <FormField>
          <Label htmlFor='code'>Country Code</Label>
          <Input
            type='text'
            id='code'
            name='code'
            // required
            defaultValue={country?.code || ""}
          />
          <FormFieldError error={error?.code} />
        </FormField>
        <FormField>
          <Label htmlFor='flagUrl'>Flag</Label>
          <Input type='file' id='flagUrl' name='flagUrl' />
          {country != null && country?.flagUrl != "" && (
            <div className='current-flag-wrapper'>
              <Label>Current Flag</Label>
              <Image
                src={country?.flagUrl || ""}
                height='100'
                width='100'
                alt='Country Flag'
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
