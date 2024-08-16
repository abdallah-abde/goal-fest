"use client";

import Image from "next/image";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Country } from "@prisma/client";

import { useFormState } from "react-dom";
import { addCountry, updateCountry } from "@/actions/countries";

import PageHeader from "@/components/PageHeader";
import SubmitButton from "@/components/forms/SubmitButton";

export default function CountryForm({ country }: { country?: Country | null }) {
  const [error, action] = useFormState(
    country == null ? addCountry : updateCountry.bind(null, country.id),
    {}
  );

  return (
    <>
      <PageHeader label={country ? "Edit Country" : "Add Country"} />
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
            defaultValue={country?.name || ""}
          />
          {error?.name && <div className='text-destructive'>{error?.name}</div>}
        </div>
        <div className='space-y-2'>
          <Label htmlFor='flagUrl'>Flag</Label>
          <Input type='file' id='flagUrl' name='flagUrl' />
          {country != null && country?.flagUrl != "" && (
            <div className='space-y-2 pt-2'>
              <Label>Current Flag</Label>
              <Image
                src={country?.flagUrl || ""}
                height='100'
                width='100'
                alt='Country Flag'
              />
              {error.flagUrl && (
                <div className='text-destructive'>{error.flagUrl}</div>
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
