"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormState, useFormStatus } from "react-dom";
import { addCountry, updateCountry } from "@/actions/countries";
import { Country } from "@prisma/client";
import Image from "next/image";

export default function CountryForm({ country }: { country?: Country | null }) {
  const [error, action] = useFormState(
    !country ? addCountry : updateCountry.bind(null, country.id),
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
          defaultValue={country?.name || ""}
        />
        {/* {error?.message && <div className='text-destructive'>{error?.message}</div>} */}
      </div>
      <div className='space-y-2'>
        <Label htmlFor='image'>Image</Label>
        <Input
          type='file'
          id='image'
          name='image'
          required={country === null}
        />
        {country != null && (
          <Image
            src={country?.flagUrl || ""}
            height='400'
            width='400'
            alt='Country Image'
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
