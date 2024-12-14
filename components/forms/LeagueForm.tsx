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
import { Continents, IsPopularOptions } from "@/types/enums";
import FormCustomErrorMessage from "@/components/forms/parts/FormCustomErrorMessage";
import FormSuccessMessage from "@/components/forms/parts/FormSuccessMessage";
import MultipleSelector, {
  MultipleSelectorRef,
  Option,
} from "../ui/multiple-selector";
import { searchCountry } from "@/lib/api-functions";
import MultipleSelectorEmptyIndicator from "./parts/MultipleSelectorEmptyIndicator";
import { MultipleSelectorLoadingIndicator } from "../Skeletons";

interface LeagueProps extends League {
  country: Country | null;
}

export default function LeagueForm({
  league,
}: {
  league?: LeagueProps | null;
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
        setContinentValue(undefined);
        setContinentKey(+new Date());

        setIsPopularValue(IsPopularOptions.No);
        setIsPopularKey(+new Date());

        setIsClubsValue(IsPopularOptions.No);
        setIsClubsKey(+new Date());

        setIsDomesticValue(IsPopularOptions.No);
        setIsDomesticKey(+new Date());

        // setCountryValue(undefined);
        setCountryKey(+new Date());
        setSelectedCountry([]);
      }

      // countryRef.current?.clearSelected();
    }
  }, [formState]);

  console.log(league);

  const [selectedCountry, setSelectedCountry] = useState<Option[]>(
    league
      ? [
          {
            dbValue: league.countryId?.toString(),
            label: `${league.country?.name} (${league.country?.continent})`,
            value: `${league.country?.name} (${league.country?.continent})`,
          },
        ]
      : []
  );

  const countryRef = useRef<MultipleSelectorRef | null>(null);

  const [countryValue, setCountryValue] = useState<number | undefined>(
    league?.countryId || undefined
  );
  const [countryKey, setCountryKey] = useState(+new Date());

  const [continentValue, setContinentValue] = useState<string | undefined>(
    league?.continent || undefined
  );
  const [continentKey, setContinentKey] = useState(+new Date());

  const [isDomesticValue, setIsDomesticValue] = useState<string | undefined>(
    league?.isDomestic === true
      ? IsPopularOptions.Yes
      : IsPopularOptions.No || undefined
  );
  const [isDomesticKey, setIsDomesticKey] = useState(+new Date());

  const [isClubsValue, setIsClubsValue] = useState<string | undefined>(
    league?.isClubs === true
      ? IsPopularOptions.Yes
      : IsPopularOptions.No || undefined
  );
  const [isClubsKey, setIsClubsKey] = useState(+new Date());

  const [isPopularValue, setIsPopularValue] = useState<string | undefined>(
    league?.isPopular === true
      ? IsPopularOptions.Yes
      : IsPopularOptions.No || undefined
  );
  const [isPopularKey, setIsPopularKey] = useState(+new Date());

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
            // disabled={!!league}
          />
          <FormFieldError error={formState.errors?.countryId} />
        </FormField>

        <FormField>
          <Label htmlFor="flagUrl">Flag</Label>
          <Input type="file" id="flagUrl" name="flagUrl" />
          {league != null && league?.flagUrl && (
            <div className="current-flag-wrapper">
              <Label>Current Flag</Label>
              <Image
                src={league?.flagUrl || ""}
                height={150}
                width={150}
                alt={`${(league && league.name) || "League"} Flag`}
                className="aspect-video object-contain"
              />
              <FormFieldError error={formState.errors?.flagUrl} />
            </div>
          )}
        </FormField>
        <FormField>
          <Label htmlFor="isDomestic">Is Domestic</Label>
          <Select
            name="isDomestic"
            key={isDomesticKey}
            defaultValue={isDomesticValue || undefined}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Choose Domestic Option" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(IsPopularOptions).map((option) => (
                <SelectItem value={option} key={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormFieldError error={formState.errors?.isDomestic} />
        </FormField>
        <FormField>
          <Label htmlFor="isClubs">Is Clubs</Label>
          <Select
            name="isClubs"
            key={isClubsKey}
            defaultValue={isClubsValue || undefined}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Choose Clubs Option" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(IsPopularOptions).map((option) => (
                <SelectItem value={option} key={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormFieldError error={formState.errors?.isClubs} />
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
