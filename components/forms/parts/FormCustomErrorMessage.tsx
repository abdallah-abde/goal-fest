import { Ban } from "lucide-react";

export default function FormCustomErrorMessage({
  customError,
}: {
  customError?: string | null | undefined;
}) {
  return (
    <>
      {customError && (
        <p className="p-2 px-3 rounded-md w-full bg-destructive/10 text-destructive text-lg mb-2 text-center flex items-center gap-2">
          <Ban size={20} />
          {customError}
        </p>
      )}
    </>
  );
}
