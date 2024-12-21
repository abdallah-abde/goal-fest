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

import { MatchStatusOptions } from "@/types/enums";

import { updateMatchStatus } from "@/actions/matches";

export default function PopoverStatusUpdator({
  id,
  status,
  children,
}: {
  id: number;
  status?: string | null;
  children: React.ReactNode;
}) {
  const [formState, formAction] = useFormState(
    updateMatchStatus.bind(null, id),
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
          <form action={formAction} className="flex flex-col gap-4">
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
              <FormFieldError error={formState?.errors?.status} />
            </div>
            <SubmitButton />
          </form>
        </div>
      </PopoverContent>
    </Popover>
  );
}
