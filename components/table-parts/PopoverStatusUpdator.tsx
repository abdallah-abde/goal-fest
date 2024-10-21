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

import SubmitButton from "@/components/forms/parts/SubmitButton";
import FormFieldError from "@/components/forms/parts/FormFieldError";

import { MatchStatusOptions } from "@/types/enums";
import { updateGroupMatchStatus } from "@/actions/groupMatches";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateKnockoutMatchStatus } from "@/actions/knockoutMatches";
import { updateLeagueMatchStatus } from "@/actions/leagueMatches";

export default function PopoverStatusUpdator({
  id,
  status,
  type,
  children,
}: {
  id: number;
  status?: string | null;
  type: "matches" | "knockoutMatches" | "leagueMatches";
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();

  const [error, action] = useFormState(
    type === "matches"
      ? updateGroupMatchStatus.bind(null, {
          id,
          searchParams: searchParams.toString(),
        })
      : type === "knockoutMatches"
      ? updateKnockoutMatchStatus.bind(null, {
          id,
          searchParams: searchParams.toString(),
        })
      : updateLeagueMatchStatus.bind(null, {
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
            Update Status
          </h4>
          <form action={action} className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue={status || ""}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Choose Status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(MatchStatusOptions).map((opt) => (
                    <SelectItem value={opt} key={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormFieldError error={error?.status} />
            </div>
            <SubmitButton />
          </form>
        </div>
      </PopoverContent>
    </Popover>
  );
}
