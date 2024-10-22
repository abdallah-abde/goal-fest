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

import { Tournament } from "@prisma/client";

import { useFormState } from "react-dom";
import { addTournament, updateTournament } from "@/actions/tournaments";

import PageHeader from "@/components/PageHeader";
import SubmitButton from "@/components/forms/parts/SubmitButton";
import FormField from "@/components/forms/parts/FormField";
import FormFieldError from "@/components/forms/parts/FormFieldError";
import { useState } from "react";
import { IsPopularOptions, TournamentTypes } from "@/types/enums";

export default function TournamentForm({
  tournament,
}: {
  tournament?: Tournament | null;
}) {
  const [error, action] = useFormState(
    tournament == null
      ? addTournament
      : updateTournament.bind(null, tournament.id),
    {}
  );

  const [isPopularValue, setIsPopularValue] = useState<string>(
    tournament?.isPopular ? IsPopularOptions.Yes : IsPopularOptions.No
  );
  const [isPopularKey, setIsPopularKey] = useState(+new Date());

  return (
    <>
      <PageHeader label={tournament ? "Edit Tournament" : "Add Tournament"} />
      <form action={action} className="form-styles">
        <FormField>
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            defaultValue={tournament?.name || ""}
            autoFocus
          />
          <FormFieldError error={error?.name} />
        </FormField>
        <FormField>
          <Label htmlFor="type">Type</Label>
          <Select name="type" defaultValue={tournament?.type || ""}>
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
          <FormFieldError error={error?.type} />
        </FormField>
        <FormField>
          <Label htmlFor="logoUrl">Logo</Label>
          <Input type="file" id="logoUrl" name="logoUrl" />
          {tournament != null && tournament?.logoUrl && (
            <div className="current-flag-wrapper">
              <Label>Current Logo</Label>
              <Image
                src={tournament?.logoUrl || ""}
                height="100"
                width="100"
                alt={`${(tournament && tournament.name) || "Tournament"} Logo`}
                className="w-20 h-20"
              />
              <FormFieldError error={error?.logoUrl} />
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
            <FormFieldError error={error?.isPopular} />
          </div>
        </FormField>
        <SubmitButton />
      </form>
    </>
  );
}
