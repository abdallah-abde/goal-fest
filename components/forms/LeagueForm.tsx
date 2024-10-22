"use client";

import Image from "next/image";

import { useState } from "react";

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

import { useFormState } from "react-dom";
import { addLeague, updateLeague } from "@/actions/leagues";

import PageHeader from "@/components/PageHeader";
import SubmitButton from "@/components/forms/parts/SubmitButton";
import FormField from "@/components/forms/parts/FormField";
import FormFieldError from "@/components/forms/parts/FormFieldError";

import { Eraser } from "lucide-react";
import { LeagueTypes } from "@/types/enums";

export default function LeagueForm({
  league,
  countries,
}: {
  league?: League | null;
  countries: Country[];
}) {
  const [error, action] = useFormState(
    league == null ? addLeague : updateLeague.bind(null, league.id),
    {}
  );

  const [countryValue, setCountryValue] = useState<number | undefined>(
    league?.countryId || undefined
  );
  const [countryKey, setCountryKey] = useState(+new Date());

  return (
    <>
      <PageHeader label={league ? "Edit League" : "Add League"} />
      <form action={action} className="form-styles">
        <FormField>
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            defaultValue={league?.name || ""}
            autoFocus
          />
          <FormFieldError error={error?.name} />
        </FormField>
        <FormField>
          <Label htmlFor="type">Type</Label>
          <Select name="type" defaultValue={league?.type || ""}>
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
          <FormFieldError error={error?.type} />
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
            <FormFieldError error={error?.countryId} />
          </div>
        </FormField>
        <FormField>
          <Label htmlFor="logoUrl">Logo</Label>
          <Input type="file" id="logoUrl" name="logoUrl" />
          {league != null && league?.logoUrl && (
            <div className="current-flag-wrapper">
              <Label>Current Flag</Label>
              <Image
                src={league?.logoUrl || ""}
                height="100"
                width="100"
                alt={`${(league && league.name) || "League"} Logo`}
                className="w-20 h-20"
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
