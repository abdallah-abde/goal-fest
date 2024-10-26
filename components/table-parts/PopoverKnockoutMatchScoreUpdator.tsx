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

import { updateKnockoutMatchScore } from "@/actions/knockoutMatches";
import { updateLeagueKnockoutMatchScore } from "@/actions/leagueKnockoutMatches";

export default function PopoverKnockoutMatchScoreUpdator({
  id,
  homeTeamName,
  awayTeamName,
  tournamentName,
  editionName,
  roundName,
  date,
  homeGoals,
  awayGoals,
  homeExtraTimeGoals,
  awayExtraTimeGoals,
  homePenaltyGoals,
  awayPenaltyGoals,
  type,
  children,
}: {
  id: number;
  homeTeamName: string;
  awayTeamName: string;
  tournamentName: string;
  editionName: string;
  roundName: string;
  date: string;
  homeGoals: number | null;
  awayGoals: number | null;
  homeExtraTimeGoals?: number | null;
  awayExtraTimeGoals?: number | null;
  homePenaltyGoals?: number | null;
  awayPenaltyGoals?: number | null;
  type: "knockoutMatches" | "leagueKnockoutMatches";
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();

  const [error, action] = useFormState(
    type === "knockoutMatches"
      ? updateKnockoutMatchScore.bind(null, {
          id,
          searchParams: searchParams.toString(),
        })
      : updateLeagueKnockoutMatchScore.bind(null, {
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
                <div className="flex items-center gap-2">
                  <Label htmlFor="homeExtraTimeGoals">ET</Label>
                  <Input
                    id="homeExtraTimeGoals"
                    name="homeExtraTimeGoals"
                    defaultValue={homeExtraTimeGoals?.toString() || ""}
                    className="h-8"
                  />
                </div>
                <FormFieldError error={error?.homeExtraTimeGoals} />
                <div className="flex items-center gap-2">
                  <Label htmlFor="homePenaltyGoals">Pen</Label>
                  <Input
                    id="homePenaltyGoals"
                    name="homePenaltyGoals"
                    defaultValue={homePenaltyGoals?.toString() || ""}
                    className="h-8"
                  />
                </div>
                <FormFieldError error={error?.homePenaltyGoals} />
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
                <div className="flex flex-row-reverse items-center gap-2">
                  <Label htmlFor="awayExtraTimeGoals">ET</Label>
                  <Input
                    id="awayExtraTimeGoals"
                    name="awayExtraTimeGoals"
                    defaultValue={awayExtraTimeGoals?.toString() || ""}
                    className="h-8 text-end"
                  />
                </div>
                <FormFieldError error={error?.awayExtraTimeGoals} />
                <div className="flex flex-row-reverse items-center gap-2">
                  <Label htmlFor="awayPenaltyGoals">Pen</Label>
                  <Input
                    id="awayPenaltyGoals"
                    name="awayPenaltyGoals"
                    defaultValue={awayPenaltyGoals?.toString() || ""}
                    className="h-8 text-end"
                  />
                </div>
                <FormFieldError error={error?.awayPenaltyGoals} />
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
