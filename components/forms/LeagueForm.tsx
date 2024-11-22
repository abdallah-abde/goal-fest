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
import { Button } from "@/components/ui/button";

import { Country, League } from "@prisma/client";

import { addLeague, updateLeague } from "@/actions/leagues";

import PageHeader from "@/components/PageHeader";
import SubmitButton from "@/components/forms/parts/SubmitButton";
import FormField from "@/components/forms/parts/FormField";
import FormFieldError from "@/components/forms/parts/FormFieldError";

import { Eraser } from "lucide-react";
import { LeagueTypes } from "@/types/enums";
import FormCustomErrorMessage from "@/components/forms/parts/FormCustomErrorMessage";
import FormSuccessMessage from "@/components/forms/parts/FormSuccessMessage";

export default function LeagueForm({
  league,
  countries,
}: {
  league?: League | null;
  countries: Country[];
}) {
  const formRef = useRef<HTMLFormElement>(null);

  const [formState, formAction] = useFormState(
    league == null ? addLeague : updateLeague.bind(null, league.id),
    { errors: undefined, success: false, customError: null }
  );

  useEffect(() => {
    if (formState.success) {
      formRef.current?.reset();
      if (league == null) {
        setTypeValue(undefined);
        setTypeKey(+new Date());

        setCountryValue(undefined);
        setCountryKey(+new Date());
      }
    }
  }, [formState]);

  const [countryValue, setCountryValue] = useState<number | undefined>(
    league?.countryId || undefined
  );
  const [countryKey, setCountryKey] = useState(+new Date());

  const [typeValue, setTypeValue] = useState<string | undefined>(
    league?.type || undefined
  );
  const [typeKey, setTypeKey] = useState(+new Date());

  return (
    <div className="overflow-auto px-4">
      <PageHeader label={league ? "Edit League" : "Add League"} />

      <FormSuccessMessage
        success={formState.success}
        message={`League has been ${
          league == null ? "added" : "updated"
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
            defaultValue={league?.name || ""}
            autoFocus
          />
          <FormFieldError error={formState.errors?.name} />
        </FormField>
        <FormField>
          <Label htmlFor="type">Type</Label>
          <Select
            name="type"
            key={typeKey}
            defaultValue={(typeValue && typeValue.toString()) || undefined}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Choose Type" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(LeagueTypes).map((type) => (
                <SelectItem value={type} key={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormFieldError error={formState.errors?.type} />
        </FormField>
        <FormField>
          <Label htmlFor="countryId">Country</Label>
          <div>
            <div className="flex items-center gap-2">
              <Select
                name="countryId"
                key={countryKey}
                defaultValue={
                  (countryValue && countryValue.toString()) || undefined
                }
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Choose Country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map(({ id, name }) => (
                    <SelectItem value={id.toString()} key={id}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                className="bg-secondary/50 hover:bg-primary/50 transition duration-300"
                variant="outline"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setCountryValue(undefined);
                  setCountryKey(+new Date());
                }}
              >
                <Eraser strokeWidth="1.5px" />
              </Button>
            </div>
            <FormFieldError error={formState.errors?.countryId} />
          </div>
        </FormField>
        <FormField>
          <Label htmlFor="logoUrl">Logo</Label>
          <Input type="file" id="logoUrl" name="logoUrl" />
          {league != null && league?.logoUrl && (
            <div className="current-flag-wrapper">
              <Label>Current Logo</Label>
              <Image
                src={league?.logoUrl || ""}
                height={150}
                width={150}
                alt={`${(league && league.name) || "League"} Logo`}
                className="aspect-video object-contain"
              />
              <FormFieldError error={formState.errors?.logoUrl} />
            </div>
          )}
        </FormField>
        <SubmitButton />
      </form>
    </div>
  );
}
