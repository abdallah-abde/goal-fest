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
import { useSearchParams } from "next/navigation";

export default function CountryForm({ country }: { country?: Country | null }) {
  const searchParams = useSearchParams();

  const [error, action] = useFormState(
    country == null
      ? addCountry.bind(null, { searchParams: searchParams.toString() })
      : updateCountry.bind(null, {
          id: country.id,
          searchParams: searchParams.toString(),
        }),
    {}
  );

  return (
    <>
      <PageHeader label={country ? "Edit Country" : "Add Country"} />
      <form action={action} className="form-styles">
        <FormField>
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            defaultValue={country?.name || ""}
            autoFocus
          />
          <FormFieldError error={error?.name} />
        </FormField>
        <FormField>
          <Label htmlFor="code">Country Code</Label>
          <Input
            type="text"
            id="code"
            name="code"
            defaultValue={country?.code || ""}
          />
          <FormFieldError error={error?.code} />
        </FormField>
        <FormField>
          <Label htmlFor="flagUrl">Flag</Label>
          <Input type="file" id="flagUrl" name="flagUrl" />
          {country != null && country?.flagUrl && (
            <div className="current-flag-wrapper">
              <Label>Current Flag</Label>
              <Image
                src={country?.flagUrl || ""}
                height="100"
                width="100"
                alt={`${country?.name || "Country"} Flag`}
                className="w-20 h-20"
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
