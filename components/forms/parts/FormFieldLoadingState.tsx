import FormField from "@/components/forms/parts/FormField";

import { LoadingSpinner } from "@/components/Skeletons";

import { Ban } from "lucide-react";

export default function FormFieldLoadingState({
  isLoading,
  label,
  notFoundText,
}: {
  isLoading: boolean;
  label: string;
  notFoundText: string;
}) {
  return (
    <FormField>
      <div className="form-field-loading-styles">
        {isLoading ? (
          <>
            <p>{label}</p>
            <LoadingSpinner />
          </>
        ) : (
          <div className="p-3 rounded-md w-full bg-destructive/10 text-destructive self-end text-sm flex gap-2 items-center">
            <Ban size={20} />
            {notFoundText}
          </div>
        )}
      </div>
    </FormField>
  );
}
