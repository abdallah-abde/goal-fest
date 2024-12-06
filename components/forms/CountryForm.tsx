"use client";

import Image from "next/image";

import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Country } from "@prisma/client";

import { addCountry, updateCountry } from "@/actions/countries";

import PageHeader from "@/components/PageHeader";
import SubmitButton from "@/components/forms/parts/SubmitButton";
import FormField from "@/components/forms/parts/FormField";
import FormFieldError from "@/components/forms/parts/FormFieldError";

import { Continents } from "@/types/enums";
import FormSuccessMessage from "@/components/forms/parts/FormSuccessMessage";
import FormCustomErrorMessage from "@/components/forms/parts/FormCustomErrorMessage";

export default function CountryForm({ country }: { country?: Country | null }) {
  const formRef = useRef<HTMLFormElement>(null);

  const [formState, formAction] = useFormState(
    country == null ? addCountry : updateCountry.bind(null, country.id),
    { errors: undefined, success: false, customError: null }
  );

  useEffect(() => {
    if (formState.success) {
      formRef.current?.reset();
      if (country == null) {
        setContinentValue(undefined);
        setContinentKey(+new Date());
      }
    }
  }, [formState]);

  const [continentValue, setContinentValue] = useState<string | undefined>(
    country?.continent || undefined
  );
  const [continentKey, setContinentKey] = useState(+new Date());

  return (
    <div className="overflow-auto px-4">
      <PageHeader label={country ? "Edit Country" : "Add Country"} />

      <FormSuccessMessage
        success={formState.success}
        message={`Country has been ${
          country == null ? "added" : "updated"
        } successfully`}
      />

      <FormCustomErrorMessage customError={formState.customError} />

      <form action={formAction} className="form-styles" ref={formRef}>
        <FormField>
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            defaultValue={country?.name || ""}
            autoFocus
          />
          <FormFieldError error={formState.errors?.name} />
        </FormField>
        <FormField>
          <Label htmlFor="code">Code</Label>
          <Input
            type="text"
            id="code"
            name="code"
            defaultValue={country?.code || ""}
          />
          <FormFieldError error={formState.errors?.code} />
        </FormField>
        <FormField>
          <Label htmlFor="continent">Continent</Label>
          <Select
            name="continent"
            key={continentKey}
            defaultValue={
              (continentValue && continentValue.toString()) || undefined
            }
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Choose Continent" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(Continents).map((continent) => (
                <SelectItem value={continent} key={continent}>
                  {continent}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormFieldError error={formState.errors?.continent} />
        </FormField>
        <FormField>
          <Label htmlFor="flagUrl">Flag</Label>
          <Input type="file" id="flagUrl" name="flagUrl" />
          {country != null && country?.flagUrl && (
            <div className="current-flag-wrapper">
              <Label>Current Flag</Label>
              <Image
                src={country?.flagUrl || ""}
                height={150}
                width={150}
                alt={`${(country && country.name) || "Country"} Flag`}
                className="aspect-video object-contain"
              />
              <FormFieldError error={formState.errors?.flagUrl} />
            </div>
          )}
        </FormField>
        <SubmitButton />
      </form>
    </div>
  );
}
