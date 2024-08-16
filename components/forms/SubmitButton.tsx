import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

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
      {pending ? "Saving..." : "Save"}
    </Button>
  );
}
