"use client";

import { useFormState } from "react-dom";

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

import { LeagueStages } from "@/types/enums";

import { updateSeasonCurrentStage } from "@/actions/seasons";

export default function PopoverStageUpdator({
  id,
  stage,
  children,
}: {
  id: number;
  stage?: string | null;
  children: React.ReactNode;
}) {
  const [formState, formAction] = useFormState(
    updateSeasonCurrentStage.bind(null, id),
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
          <form action={formAction} className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="currentStage">Stage</Label>

              <Select name="currentStage" defaultValue={stage || ""}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Choose Stage" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(LeagueStages).map((opt) => (
                    <SelectItem value={opt} key={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormFieldError error={formState?.errors?.currentStage} />
            </div>

            <SubmitButton />
          </form>
        </div>
      </PopoverContent>
    </Popover>
  );
}
