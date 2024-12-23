"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { BadgeCheck, BadgeX } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { ChangeEvent } from "react";

interface FlagOptions {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface FlagFilter {
  title: string;
  defaultValue?: string | undefined;
  fieldName: string;
  searchParamName: string;
  options: FlagOptions[];
}

interface ListFilter {
  title: string;
  options: string[];
  fieldName: string;
  searchParamName: string;
  placeholder?: string;
  selectedOption?: string;
}

interface Datefilter {
  title: string;
  fieldName: string;
  searchParamName: string;
}

interface FiltersProps {
  flagFilters?: FlagFilter[];
  listFilters?: ListFilter[];
  filterByDate?: Datefilter | null;
  textFilters?: Datefilter[];
}

export default function Filters({
  flagFilters = [],
  listFilters = [],
  filterByDate,
  textFilters = [],
}: FiltersProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const handleFlagChanged = (fieldName: string, value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value === "all") {
      params.delete(fieldName);
    } else {
      params.set(fieldName, value);
    }

    replace(`${pathname}?${params.toString()}`);
  };

  const handleListChange = (fieldName: string, value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value === "all") {
      params.delete(fieldName);
    } else {
      params.set(fieldName, value);
    }

    replace(`${pathname}?${params.toString()}`);
  };

  const handleDateChanged = (e: ChangeEvent<HTMLInputElement>) => {
    if (filterByDate) {
      const params = new URLSearchParams(searchParams);
      params.set(filterByDate?.fieldName, e.target.value);

      if (e.target.value === "") params.delete(filterByDate?.fieldName);

      replace(`${pathname}?${params.toString()}`);
    }
  };

  const handleTextChanged = (fieldName: string, value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value === "all" || value === "") {
      params.delete(fieldName);
    } else {
      params.set(fieldName, value);
    }

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Popover>
      <PopoverTrigger>
        <div className="relative border border-dotted border-muted-foreground rounded-md">
          <span className="text-muted-foreground text-[10px] absolute -top-2 left-0 bg-muted ml-2 px-1">
            Filters
          </span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant="ghost"
                  className="focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none focus-visible:border-background/0 focus-visible:border-2 space-x-0 *:border-r *:border-muted-foreground last:*:border-r-0 *:pr-2 last:*:pr-0 *:pl-2 first:*:pl-0 min-w-28"
                >
                  {flagFilters.map((flag, idx) => {
                    const fieldParam = searchParams.get(flag.fieldName);

                    if (fieldParam) {
                      return (
                        <div key={idx} className="flex items-center">
                          {fieldParam === "yes" ? (
                            <BadgeCheck className="mr-2" size={15} />
                          ) : (
                            <BadgeX className="mr-2" size={15} />
                          )}{" "}
                          {flag.title}
                        </div>
                      );
                    } else {
                      return <></>;
                    }
                  })}

                  {listFilters.map((list, idx) => {
                    const fieldParam = searchParams.get(list.fieldName);

                    if (fieldParam) {
                      return (
                        <div key={idx} className="flex items-center">
                          <BadgeCheck className="mr-2" size={15} />{" "}
                          <span>
                            {list.title}:
                            <span className="text-muted-foreground ml-1">
                              {fieldParam}
                            </span>
                          </span>
                        </div>
                      );
                    } else {
                      return <></>;
                    }
                  })}

                  {filterByDate && searchParams.get(filterByDate.fieldName) && (
                    <div className="flex items-center">
                      <BadgeCheck className="mr-2" size={15} />{" "}
                      <span>
                        {filterByDate.title}:
                        <span className="text-muted-foreground ml-1">
                          {searchParams.get(filterByDate.fieldName)}
                        </span>
                      </span>
                    </div>
                  )}

                  {textFilters.map((list, idx) => {
                    const fieldParam = searchParams.get(list.fieldName);

                    if (fieldParam) {
                      return (
                        <div key={idx} className="flex items-center">
                          <BadgeCheck className="mr-2" size={15} />{" "}
                          <span>
                            {list.title}:
                            <span className="text-muted-foreground ml-1">
                              {fieldParam}
                            </span>
                          </span>
                        </div>
                      );
                    } else {
                      return <></>;
                    }
                  })}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click to Filter</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </PopoverTrigger>
      <PopoverContent className="overflow-auto w-[960px]">
        <p className="text-muted-foreground pb-1">Filters</p>
        <div className="flex justify-center items-stretch gap-2 flex-wrap *:w-[280px]">
          {flagFilters.length > 0 &&
            flagFilters.map((flag, idx) => (
              <Card key={idx} className="p-2">
                <CardTitle className="text-sm">{flag.title}</CardTitle>
                <CardContent className="py-2">
                  <RadioGroup
                    defaultValue={
                      searchParams.get(flag.searchParamName) ||
                      flag.defaultValue
                    }
                    className="flex gap-2 items-center"
                  >
                    {flag.options.map((filter, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={filter.value}
                          onClick={() =>
                            handleFlagChanged(flag.fieldName, filter.value)
                          }
                        />
                        <Label>{filter.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            ))}

          {listFilters.length > 0 &&
            listFilters.map((listFilter, index) => (
              <Card key={index} className="p-2">
                <CardTitle className="text-sm">{listFilter.title}</CardTitle>
                <CardContent className="py-2">
                  <Select
                    name={listFilter.fieldName}
                    defaultValue={
                      searchParams.get(listFilter.searchParamName) || "all"
                    }
                    onValueChange={(value) =>
                      handleListChange(listFilter.fieldName, value)
                    }
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue
                        placeholder={listFilter.placeholder || "Choose"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {listFilter.options.map((opt) => (
                        <SelectItem value={opt} key={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            ))}

          {filterByDate && (
            <Card className="p-2">
              <CardTitle className="text-sm">{filterByDate.title}</CardTitle>
              <CardContent className="py-2">
                <Input
                  type="date"
                  id="date"
                  name="date"
                  defaultValue={
                    searchParams.get(filterByDate.fieldName) || undefined
                  }
                  onChange={handleDateChanged}
                />
              </CardContent>
            </Card>
          )}

          {textFilters?.length > 0 &&
            textFilters?.map((filter, idx) => (
              <Card className="p-2" key={idx}>
                <CardTitle className="text-sm">{filter.title}</CardTitle>
                <CardContent className="py-2">
                  <Input
                    type="text"
                    id={filter.fieldName}
                    name={filter.fieldName}
                    defaultValue={
                      searchParams.get(filter.fieldName) || undefined
                    }
                    onChange={(e) =>
                      handleTextChanged(filter.fieldName, e.target.value)
                    }
                  />
                </CardContent>
              </Card>
            ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
