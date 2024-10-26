"use client";

import Image from "next/image";

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

import { Country, LeagueTeam } from "@prisma/client";

import { useFormState } from "react-dom";
import { addLeagueTeam, updateLeagueTeam } from "@/actions/leagueTeams";

import PageHeader from "@/components/PageHeader";
import SubmitButton from "@/components/forms/parts/SubmitButton";
import FormField from "@/components/forms/parts/FormField";
import FormFieldError from "@/components/forms/parts/FormFieldError";
import { useState } from "react";
import { Eraser } from "lucide-react";

export default function LeagueTeamForm({
  leagueTeam,
  countries,
}: {
  leagueTeam?: LeagueTeam | null;
  countries: Country[];
}) {
  const [error, action] = useFormState(
    leagueTeam == null
      ? addLeagueTeam
      : updateLeagueTeam.bind(null, leagueTeam.id),
    {}
  );

  const [countryValue, setCountryValue] = useState<number | undefined>(
    leagueTeam?.countryId || undefined
  );
  const [countryKey, setCountryKey] = useState(+new Date());

  return (
    <>
      <PageHeader label={leagueTeam ? "Edit LeagueTeam" : "Add LeagueTeam"} />
      <form action={action} className="form-styles">
        <FormField>
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            defaultValue={leagueTeam?.name || ""}
            autoFocus
          />
          <FormFieldError error={error?.name} />
        </FormField>
        <FormField>
          <Label htmlFor="code">Team Code</Label>
          <Input
            type="text"
            id="code"
            name="code"
            defaultValue={leagueTeam?.code || ""}
          />
          <FormFieldError error={error?.code} />
        </FormField>
        <FormField>
          <Label htmlFor="flagUrl">Flag</Label>
          <Input type="file" id="flagUrl" name="flagUrl" />
          {leagueTeam != null && leagueTeam?.flagUrl && (
            <div className="current-flag-wrapper">
              <Label>Current Flag</Label>
              <Image
                src={leagueTeam?.flagUrl || ""}
                height="100"
                width="100"
                alt={`${(leagueTeam && leagueTeam.name) || "League Team"} Logo`}
                className="w-20 h-20"
              />
              <FormFieldError error={error?.flagUrl} />
            </div>
          )}
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
        <SubmitButton />
      </form>
    </>
  );
}
