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

import { Team } from "@prisma/client";

import { addTeam, updateTeam } from "@/actions/teams";

import PageHeader from "@/components/PageHeader";
import SubmitButton from "@/components/forms/parts/SubmitButton";
import FormField from "@/components/forms/parts/FormField";
import FormFieldError from "@/components/forms/parts/FormFieldError";

import { Ban, Check } from "lucide-react";
import { Continents } from "@/types/enums";

export default function TeamForm({ team }: { team?: Team | null }) {
  const formRef = useRef<HTMLFormElement>(null);

  const [formState, formAction] = useFormState(
    team == null ? addTeam : updateTeam.bind(null, team.id),
    { errors: undefined, success: false, customError: null }
  );

  useEffect(() => {
    if (formState.success) {
      formRef.current?.reset();
      if (team == null) {
        setTypeValue(undefined);
        setTypeKey(+new Date());
      }
    }
  }, [formState]);

  const [typeValue, setTypeValue] = useState<string | undefined>(
    team?.type || undefined
  );
  const [typeKey, setTypeKey] = useState(+new Date());

  return (
    <div className="overflow-auto px-4">
      <PageHeader label={team ? "Edit Team" : "Add Team"} />

      {formState.success && (
        <p className="p-2 px-3 rounded-md w-full bg-emerald-500/10 text-emerald-500 text-lg mb-2 text-center flex items-center gap-2">
          <Check size={20} />
          Team has been {team == null ? "added" : "updated"} successfully
        </p>
      )}

      {formState.customError && (
        <p className="p-2 px-3 rounded-md w-full bg-destructive/10 text-destructive text-lg mb-2 text-center flex items-center gap-2">
          <Ban size={20} />
          {formState.customError}
        </p>
      )}

      <form action={formAction} className="form-styles" ref={formRef}>
        <FormField>
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            defaultValue={team?.name || ""}
            autoFocus
          />
          <FormFieldError error={formState.errors?.name} />
        </FormField>
        <FormField>
          <Label htmlFor="code">Team Code</Label>
          <Input
            type="text"
            id="code"
            name="code"
            defaultValue={team?.code || ""}
          />
          <FormFieldError error={formState.errors?.code} />
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
              {Object.values(Continents).map((type) => (
                <SelectItem value={type} key={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormFieldError error={formState.errors?.type} />
        </FormField>
        <FormField>
          <Label htmlFor="flagUrl">Flag</Label>
          <Input type="file" id="flagUrl" name="flagUrl" />
          {team != null && team?.flagUrl && (
            <div className="current-flag-wrapper">
              <Label>Current Flag</Label>
              <Image
                src={team?.flagUrl || ""}
                height={150}
                width={150}
                alt={`${(team && team.name) || "Team"} Flag`}
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
