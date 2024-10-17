"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { TournamentEdition } from "@prisma/client";

import { useFormState } from "react-dom";
import { updateTournamentEditionCurrentStage } from "@/actions/editions";

import PageHeader from "@/components/PageHeader";
import SubmitButton from "@/components/forms/parts/SubmitButton";
import FormField from "@/components/forms/parts/FormField";
import FormFieldError from "@/components/forms/parts/FormFieldError";
import { TournamentStages } from "@/types/enums";

export default function CurrentStageFormForm({
  tournamentEdition,
}: {
  tournamentEdition: TournamentEdition;
}) {
  const [error, action] = useFormState(
    updateTournamentEditionCurrentStage.bind(null, tournamentEdition.id),
    {}
  );

  return (
    <>
      <PageHeader
        label={
          tournamentEdition
            ? "Edit Tournament Edition Current Stage"
            : "Add Tournament Edition Current Stage"
        }
      />
      <form action={action} className="form-styles">
        <FormField>
          <Label htmlFor="currentStage">Current Stage</Label>
          <Input
            id="currentStage"
            name="currentStage"
            defaultValue={tournamentEdition?.currentStage || undefined}
            list="stages"
          />
          <datalist id="stages">
            {Object.values(TournamentStages).map((dl) => (
              <option value={dl}></option>
            ))}
          </datalist>
          <FormFieldError error={error?.currentStage} />
        </FormField>
        <SubmitButton />
      </form>
    </>
  );
}
