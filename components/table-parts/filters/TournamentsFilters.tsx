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

import { IsPopularOptions, TournamentTypes } from "@/types/enums";

import { BadgeCheck, BadgeX } from "lucide-react";

export default function TorunamentsFilters() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const handleIsPopularChanged = (value?: boolean | null) => {
    const params = new URLSearchParams(searchParams);

    if (value === true) {
      params.set("isPopular", IsPopularOptions.Yes);
    } else if (value === false) {
      params.set("isPopular", IsPopularOptions.No);
    } else {
      params.delete("isPopular");
    }

    replace(`${pathname}?${params.toString()}`);
  };

  const handleTypeChange = (value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value === "all") {
      params.delete("type");
    } else {
      params.set("type", value);
    }

    replace(`${pathname}?${params.toString()}`);
  };

  const currentIsPopularField = searchParams.get("isPopular") || undefined;
  const currentTypeField = searchParams.get("type") || "all";

  return (
    <Popover>
      <PopoverTrigger>
        <div className="relative border border-dotted border-muted-foreground rounded-md">
          <span className="text-muted-foreground text-[10px] absolute -top-2 left-0 bg-muted ml-2 px-1">
            Filters
          </span>
          <Button
            variant="ghost"
            className="focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none focus-visible:border-background/0 focus-visible:border-2 space-x-0 *:border-r *:border-muted-foreground last:*:border-r-0 *:pr-2 last:*:pr-0 *:pl-2 first:*:pl-0"
          >
            {!currentIsPopularField && currentTypeField === "all" ? (
              "No filters"
            ) : (
              <></>
            )}

            {currentIsPopularField === IsPopularOptions.Yes ? (
              <div className="flex items-center">
                <BadgeCheck className="mr-2" size={15} /> Is Popular
              </div>
            ) : currentIsPopularField === IsPopularOptions.No ? (
              <div className="flex items-center">
                <BadgeX className="mr-2" size={15} /> Is Popular
              </div>
            ) : (
              <></>
            )}

            {currentTypeField !== "all" ? (
              <div className="flex items-center">
                <BadgeCheck className="mr-2" size={15} />{" "}
                <span>
                  Type:
                  <span className="text-muted-foreground ml-1">
                    {currentTypeField}
                  </span>
                </span>
              </div>
            ) : (
              <></>
            )}
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-fit">
        <p className="text-muted-foreground pb-1">Filters</p>
        <div className="space-y-2">
          <Card className="p-2">
            <CardTitle className="text-sm">Is Popular</CardTitle>
            <CardContent className="py-2">
              <RadioGroup
                defaultValue={
                  !currentIsPopularField ? "all" : currentIsPopularField
                }
                className="flex gap-2 items-center"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="all"
                    id="all"
                    onClick={() => handleIsPopularChanged(null)}
                  />
                  <Label htmlFor="all">All</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={IsPopularOptions.Yes}
                    id={IsPopularOptions.Yes}
                    onClick={() => handleIsPopularChanged(true)}
                  />
                  <Label htmlFor={IsPopularOptions.Yes}>Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={IsPopularOptions.No}
                    id={IsPopularOptions.No}
                    onClick={() => handleIsPopularChanged(false)}
                  />
                  <Label htmlFor={IsPopularOptions.No}>No</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
          <Card className="p-2">
            <CardTitle className="text-sm">Type</CardTitle>
            <CardContent className="py-2">
              <Select
                name="type"
                defaultValue={currentTypeField}
                onValueChange={handleTypeChange}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Choose Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {Object.values(TournamentTypes).map((opt) => (
                    <SelectItem value={opt} key={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>
      </PopoverContent>
    </Popover>
  );
}
