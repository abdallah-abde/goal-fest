"use client";

import { useFormState } from "react-dom";
import { useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

import SubmitButton from "@/components/forms/parts/SubmitButton";
import FormFieldError from "@/components/forms/parts/FormFieldError";

import { X } from "lucide-react";

import { updateGroupMatchScore } from "@/actions/groupMatches";
import { updateLeagueMatchScore } from "@/actions/leagueMatches";

export default function PopoverMatchScoreUpdator({
  id,
  type,
  homeTeamName,
  awayTeamName,
  tournamentName,
  editionName,
  roundName,
  date,
  homeGoals,
  awayGoals,
  children,
}: {
  id: number;
  type: string;
  homeTeamName: string;
  awayTeamName: string;
  tournamentName: string;
  editionName: string;
  roundName: string;
  date: string;
  homeGoals: number | null;
  awayGoals: number | null;
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();

  const [error, action] = useFormState(
    type === "leagueMatches"
      ? updateLeagueMatchScore.bind(null, {
          id,
          searchParams: searchParams.toString(),
        })
      : updateGroupMatchScore.bind(null, {
          id,
          searchParams: searchParams.toString(),
        }),
    null
  );

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-96">
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none text-center border-b pb-4">
              Update Score
            </h4>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 items-center justify-between border-b pb-2">
                <div className="flex flex-col items-start">
                  <span className="text-[16px] text-muted-background">
                    {tournamentName}
                  </span>
                  <span className="text-[12px] text-muted-foreground">
                    ({editionName})
                  </span>
                </div>
                {roundName && (
                  <span className="text-sm text-muted-foreground">
                    {roundName}
                  </span>
                )}
              </div>
              <div className="flex gap-2 items-center justify-between">
                <span className="text-sm text-muted-foreground flex-1">
                  {homeTeamName}
                </span>
                <X size="15" className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground flex-1 text-end">
                  {awayTeamName}
                </span>
              </div>
            </div>
          </div>
          <form action={action} className="flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="homeGoals">MT</Label>
                  <Input
                    id="homeGoals"
                    name="homeGoals"
                    defaultValue={homeGoals?.toString() || ""}
                    className="h-8"
                  />
                </div>
                <FormFieldError error={error?.homeGoals} />
              </div>
              <div className="flex flex-col gap-2 justify-end">
                <div className="flex flex-row-reverse items-center gap-2">
                  <Label htmlFor="awayGoals">MT</Label>
                  <Input
                    id="awayGoals"
                    name="awayGoals"
                    defaultValue={awayGoals?.toString() || ""}
                    className="h-8 text-end"
                  />
                </div>
                <FormFieldError error={error?.awayGoals} />
              </div>
            </div>
            <Separator />
            <SubmitButton />
          </form>
        </div>
      </PopoverContent>
    </Popover>
  );
}
