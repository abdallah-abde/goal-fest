import FormField from "@/components/forms/parts/FormField";

import { LoadingSpinner } from "@/components/LoadingComponents";

import FormNoDataFound from "@/components/FormNoDataFound";

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
      <div className='form-field-loading-styles'>
        {isLoading ? (
          <>
            <p>{label}</p>
            <LoadingSpinner />
          </>
        ) : (
          <FormNoDataFound text={notFoundText} />
        )}
      </div>
    </FormField>
  );
}
