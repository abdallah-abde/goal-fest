"use client";

import { useFormState } from "react-dom";
import { useSearchParams } from "next/navigation";

import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import SubmitButton from "@/components/forms/parts/SubmitButton";
import FormFieldError from "@/components/forms/parts/FormFieldError";

import { TournamentStages, LeagueStages } from "@/types/enums";

import { updateTournamentEditionCurrentStage } from "@/actions/editions";
import { updateLeagueSeasonCurrentStage } from "@/actions/seasons";

export default function PopoverStageUpdator({
  id,
  stage,
  type,
  children,
}: {
  id: number;
  type: "tournaments" | "leagues";
  stage?: string | null;
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();

  const [error, action] = useFormState(
    type === "tournaments"
      ? updateTournamentEditionCurrentStage.bind(null, {
          id,
          searchParams: searchParams.toString(),
        })
      : updateLeagueSeasonCurrentStage.bind(null, {
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
          <h4 className="font-medium leading-none text-center border-b pb-4">
            Update Stage
          </h4>
          <form action={action} className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="currentStage">Stage</Label>

              <Select name="currentStage" defaultValue={stage || ""}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Choose Stage" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(
                    type === "tournaments" ? TournamentStages : LeagueStages
                  ).map((opt) => (
                    <SelectItem value={opt} key={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormFieldError error={error?.currentStage} />
            </div>

            <SubmitButton />
          </form>
        </div>
      </PopoverContent>
    </Popover>
  );
}
