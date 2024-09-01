import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/LoadingComponents";

export default function SubmitButton({
  isDisabled = false,
}: {
  isDisabled?: boolean | null;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type='submit'
      disabled={pending || (isDisabled ? isDisabled : pending)}
      className='font-bold w-fit'
    >
      {pending ? (
        <>
          <LoadingSpinner /> <span className='ml-2'>Saving...</span>
        </>
      ) : (
        "Save"
      )}
    </Button>
  );
}
