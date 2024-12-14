"use client";

import Image from "next/image";

import { LegacyRef, useEffect, useRef, useState } from "react";
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

import { Country, Team } from "@prisma/client";

import { addLeagueTeam, updateLeagueTeam } from "@/actions/leagueTeams";

import PageHeader from "@/components/PageHeader";
import SubmitButton from "@/components/forms/parts/SubmitButton";
import FormField from "@/components/forms/parts/FormField";
import FormFieldError from "@/components/forms/parts/FormFieldError";

import { Eraser } from "lucide-react";
import { Continents, IsPopularOptions } from "@/types/enums";

import FormSuccessMessage from "@/components/forms/parts/FormSuccessMessage";
import FormCustomErrorMessage from "@/components/forms/parts/FormCustomErrorMessage";
import MultipleSelector, {
  MultipleSelectorRef,
  Option,
} from "../ui/multiple-selector";
import MultipleSelectorEmptyIndicator from "./parts/MultipleSelectorEmptyIndicator";
import { MultipleSelectorLoadingIndicator } from "../Skeletons";
import { searchCountry } from "@/lib/api-functions";

interface TeamProps extends Team {
  country: Country | null;
}

export default function LeagueTeamForm({ team }: { team?: TeamProps | null }) {
  const formRef = useRef<HTMLFormElement>(null);

  const [formState, formAction] = useFormState(
    team == null ? addLeagueTeam : updateLeagueTeam.bind(null, team.id),
    { errors: undefined, success: false, customError: null }
  );

  useEffect(() => {
    if (formState.success) {
      formRef.current?.reset();
      if (team == null) {
        setContinentValue(undefined);
        setContinentKey(+new Date());

        setIsClubKey(+new Date());
        setIsClubValue(IsPopularOptions.No);

        setIsPopularKey(+new Date());
        setIsPopularValue(IsPopularOptions.No);

        // setCountryValue(undefined);
        setCountryKey(+new Date());
        setSelectedCountry([]);
      }
      // countryRef.current?.clearSelected();
    }
  }, [formState]);

  const [selectedCountry, setSelectedCountry] = useState<Option[]>(
    team
      ? [
          {
            dbValue: team.countryId?.toString(),
            label: `${team.country?.name} (${team.continent})`,
            value: `${team.country?.name} (${team.continent})`,
          },
        ]
      : []
  );

  const countryRef = useRef<MultipleSelectorRef | null>(null);

  // const [countryValue, setCountryValue] = useState<number | undefined>(
  //   team?.countryId || undefined
  // );
  const [countryKey, setCountryKey] = useState(+new Date());

  const [continentValue, setContinentValue] = useState<string | undefined>(
    team?.continent || undefined
  );
  const [continentKey, setContinentKey] = useState(+new Date());

  const [isClubValue, setIsClubValue] = useState<string | undefined>(
    team?.isClub === true
      ? IsPopularOptions.Yes
      : IsPopularOptions.No || undefined
  );
  const [isClubKey, setIsClubKey] = useState(+new Date());

  const [isPopularValue, setIsPopularValue] = useState<string | undefined>(
    team?.isPopular === true
      ? IsPopularOptions.Yes
      : IsPopularOptions.No || undefined
  );
  const [isPopularKey, setIsPopularKey] = useState(+new Date());

  return (
    <div className="overflow-auto px-4">
      <PageHeader label={team ? "Edit Team" : "Add Team"} />

      <FormSuccessMessage
        success={formState.success}
        message={`Team has been ${
          team == null ? "added" : "updated"
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
            defaultValue={team?.name || ""}
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
            defaultValue={team?.code || ""}
          />
          <FormFieldError error={formState.errors?.code} />
        </FormField>
        <FormField>
          <Label htmlFor="countryId">Country</Label>
          <Input
            type="hidden"
            id="countryId"
            name="countryId"
            value={selectedCountry[0]?.dbValue || ""}
          />
          <MultipleSelector
            ref={countryRef}
            className="form-multiple-selector-styles"
            hideClearAllButton
            hidePlaceholderWhenSelected
            badgeClassName="text-primary"
            onSearch={async (value) => {
              const res = await searchCountry(value);
              return res;
            }}
            maxSelected={1}
            placeholder="Select country"
            emptyIndicator={
              <MultipleSelectorEmptyIndicator label="No countries found" />
            }
            loadingIndicator={<MultipleSelectorLoadingIndicator />}
            onChange={setSelectedCountry}
            value={selectedCountry}
            // disabled={!!team}
          />
          <FormFieldError error={formState.errors?.countryId} />
        </FormField>
        {/* <FormField>
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
          </div>
          <FormFieldError error={formState.errors?.countryId} />
        </FormField> */}
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
                alt={`${(team && team.name) || "League Team"} Flag`}
                className="aspect-video object-contain"
              />
              <FormFieldError error={formState.errors?.flagUrl} />
            </div>
          )}
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
              <SelectValue placeholder="Choose continent" />
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
          <Label htmlFor="isClub">Is Club</Label>
          <Select
            name="isClub"
            key={isClubKey}
            defaultValue={isClubValue || undefined}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Choose Club Option" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(IsPopularOptions).map((option) => (
                <SelectItem value={option} key={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormFieldError error={formState.errors?.isClub} />
        </FormField>
        <FormField>
          <Label htmlFor="isPopular">Is Popular</Label>
          <Select
            name="isPopular"
            key={isPopularKey}
            defaultValue={isPopularValue || undefined}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Choose Popular Option" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(IsPopularOptions).map((option) => (
                <SelectItem value={option} key={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormFieldError error={formState.errors?.isPopular} />
        </FormField>
        <SubmitButton />
      </form>
    </div>
  );
}
