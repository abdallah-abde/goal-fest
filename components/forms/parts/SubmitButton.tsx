import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/Skeletons";

export default function SubmitButton({
  isDisabled = false,
}: {
  isDisabled?: boolean | null;
}) {
  const { pending } = useFormStatus();

  return (
    <div className="col-span-2">
      <Button
        type="submit"
        disabled={pending || (isDisabled ? isDisabled : pending)}
        className="font-bold w-fit"
      >
        {pending ? (
          <>
            <LoadingSpinner /> <span className="ml-2">Saving...</span>
          </>
        ) : (
          "Save"
        )}
      </Button>
    </div>
  );
}
