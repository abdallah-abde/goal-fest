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
import { Badge } from "@/components/ui/badge";

import SubmitButton from "@/components/forms/parts/SubmitButton";
import FormFieldError from "@/components/forms/parts/FormFieldError";

import { X } from "lucide-react";

import { updateMatchScore } from "@/actions/matches";

export default function PopoverMatchScoreUpdator({
  id,
  homeTeamName,
  awayTeamName,
  leagueName,
  seasonName,
  roundName,
  groupName,
  date,
  homeGoals,
  awayGoals,
  homeExtraTimeGoals,
  awayExtraTimeGoals,
  homePenaltyGoals,
  awayPenaltyGoals,
  isKnockout,
  children,
}: {
  id: number;
  homeTeamName: string;
  awayTeamName: string;
  leagueName: string;
  seasonName: string;
  roundName: string;
  groupName: string;
  date: string;
  homeGoals: number | null;
  awayGoals: number | null;
  homeExtraTimeGoals: number | null;
  awayExtraTimeGoals: number | null;
  homePenaltyGoals: number | null;
  awayPenaltyGoals: number | null;
  isKnockout: boolean;
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();

  const [formState, formAction] = useFormState(
    updateMatchScore.bind(null, id),
    { errors: undefined, success: false, customError: null }
  );

  const [onlyDate, onlyTime] = date.split(";");

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
              <div className="flex gap-2 items-start justify-between border-b pb-2">
                <div className="flex flex-col items-center justify-center">
                  <span className="text-[16px] text-muted-background">
                    {leagueName}
                  </span>
                  <span className="text-[12px] text-muted-foreground">
                    ({seasonName})
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center gap-2">
                  <Badge variant="destructive" className="hover:bg-destructive">
                    {onlyDate}
                  </Badge>
                  {onlyTime && (
                    <Badge variant="outline" className="pt-1">
                      {onlyTime}
                    </Badge>
                  )}
                </div>
                <div className="flex flex-col items-center justify-center">
                  {groupName && (
                    <span className="text-[16px] text-muted-background">
                      {groupName}
                    </span>
                  )}
                  {roundName && (
                    <span className="text-[12px] text-muted-foreground">
                      {roundName}
                    </span>
                  )}
                </div>
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
          <form action={formAction} className="flex flex-col gap-4">
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
                <FormFieldError error={formState.errors?.homeGoals} />
                {isKnockout && (
                  <>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="homeExtraTimeGoals">ET</Label>
                      <Input
                        id="homeExtraTimeGoals"
                        name="homeExtraTimeGoals"
                        defaultValue={homeExtraTimeGoals?.toString() || ""}
                        className="h-8"
                      />
                    </div>
                    <FormFieldError
                      error={formState.errors?.homeExtraTimeGoals}
                    />
                    <div className="flex items-center gap-2">
                      <Label htmlFor="homePenaltyGoals">PT</Label>
                      <Input
                        id="homePenaltyGoals"
                        name="homePenaltyGoals"
                        defaultValue={homePenaltyGoals?.toString() || ""}
                        className="h-8"
                      />
                    </div>
                    <FormFieldError
                      error={formState.errors?.homePenaltyGoals}
                    />
                  </>
                )}
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
                <FormFieldError error={formState.errors?.awayGoals} />
                {isKnockout && (
                  <>
                    <div className="flex flex-row-reverse items-center gap-2">
                      <Label htmlFor="awayExtraTimeGoals">ET</Label>
                      <Input
                        id="awayExtraTimeGoals"
                        name="awayExtraTimeGoals"
                        defaultValue={awayExtraTimeGoals?.toString() || ""}
                        className="h-8 text-end"
                      />
                    </div>
                    <FormFieldError
                      error={formState.errors?.awayExtraTimeGoals}
                    />
                    <div className="flex flex-row-reverse items-center gap-2">
                      <Label htmlFor="awayPenaltyGoals">PT</Label>
                      <Input
                        id="awayPenaltyGoals"
                        name="awayPenaltyGoals"
                        defaultValue={awayPenaltyGoals?.toString() || ""}
                        className="h-8 text-end"
                      />
                    </div>
                    <FormFieldError
                      error={formState.errors?.awayPenaltyGoals}
                    />
                  </>
                )}
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
