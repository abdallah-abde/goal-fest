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

import { Tournament } from "@prisma/client";

import { addTournament, updateTournament } from "@/actions/tournaments";

import PageHeader from "@/components/PageHeader";
import SubmitButton from "@/components/forms/parts/SubmitButton";
import FormField from "@/components/forms/parts/FormField";
import FormFieldError from "@/components/forms/parts/FormFieldError";

import { IsPopularOptions, TournamentTypes } from "@/types/enums";

import FormSuccessMessage from "@/components/forms/parts/FormSuccessMessage";
import FormCustomErrorMessage from "@/components/forms/parts/FormCustomErrorMessage";

export default function TournamentForm({
  tournament,
}: {
  tournament?: Tournament | null;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  const [formState, formAction] = useFormState(
    tournament == null
      ? addTournament
      : updateTournament.bind(null, tournament.id),
    { errors: undefined, success: false, customError: null }
  );

  useEffect(() => {
    if (formState.success) {
      formRef.current?.reset();
      if (tournament == null) {
        setTypeValue(undefined);
        setTypeKey(+new Date());
      }
    }
  }, [formState]);

  const [typeValue, setTypeValue] = useState<string | undefined>(
    tournament?.type || undefined
  );
  const [typeKey, setTypeKey] = useState(+new Date());

  const [isPopularValue, setIsPopularValue] = useState<string>(
    tournament?.isPopular ? IsPopularOptions.Yes : IsPopularOptions.No
  );
  const [isPopularKey, setIsPopularKey] = useState(+new Date());

  return (
    <div className="overflow-auto px-4">
      <PageHeader label={tournament ? "Edit Tournament" : "Add Tournament"} />

      <FormSuccessMessage
        success={formState.success}
        message={`Tournament has been ${
          tournament == null ? "added" : "updated"
        } successfully`}
      />

      <FormCustomErrorMessage customError={formState.customError} />

      <form action={formAction} className="form-styles">
        <FormField>
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            defaultValue={tournament?.name || ""}
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
              {Object.values(TournamentTypes).map((type) => (
                <SelectItem value={type} key={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormFieldError error={formState.errors?.type} />
        </FormField>
        <FormField>
          <Label htmlFor="logoUrl">Logo</Label>
          <Input type="file" id="logoUrl" name="logoUrl" />
          {tournament != null && tournament?.logoUrl && (
            <div className="current-flag-wrapper">
              <Label>Current Logo</Label>
              <Image
                src={tournament?.logoUrl || ""}
                height={150}
                width={150}
                alt={`${(tournament && tournament.name) || "Tournament"} Logo`}
                className="aspect-video object-contain"
              />
              <FormFieldError error={formState.errors?.logoUrl} />
            </div>
          )}
        </FormField>
        <FormField>
          <Label htmlFor="isPopular">Is Popular</Label>
          <div>
            <Select
              name="isPopular"
              key={isPopularKey}
              defaultValue={isPopularValue || IsPopularOptions.No}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Choose IsPopular" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={IsPopularOptions.No}>
                  {IsPopularOptions.No}
                </SelectItem>
                <SelectItem value={IsPopularOptions.Yes}>
                  {IsPopularOptions.Yes}
                </SelectItem>
              </SelectContent>
            </Select>
            <FormFieldError error={formState.errors?.isPopular} />
          </div>
        </FormField>
        <SubmitButton />
      </form>
    </div>
  );
}
