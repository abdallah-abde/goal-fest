"use client";

import Image from "next/image";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { LeagueTeam } from "@prisma/client";

import { useFormState } from "react-dom";
import { addLeagueTeam, updateLeagueTeam } from "@/actions/leagueTeams";

import PageHeader from "@/components/PageHeader";
import SubmitButton from "@/components/forms/parts/SubmitButton";
import FormField from "@/components/forms/parts/FormField";
import FormFieldError from "@/components/forms/parts/FormFieldError";

export default function LeagueTeamForm({
  leagueTeam,
}: {
  leagueTeam?: LeagueTeam | null;
}) {
  const [error, action] = useFormState(
    leagueTeam == null
      ? addLeagueTeam
      : updateLeagueTeam.bind(null, leagueTeam.id),
    {}
  );

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
            // required
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
            // required
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
                alt="Team Flag"
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
