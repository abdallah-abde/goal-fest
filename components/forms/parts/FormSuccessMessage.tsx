import { Check } from "lucide-react";

export default function FormSuccessMessage({
  success,
  message,
}: {
  success: boolean;
  message: string;
}) {
  return (
    <>
      {success && (
        <p className="p-2 px-3 rounded-md w-full bg-emerald-500/10 text-emerald-500 text-lg mb-2 text-center flex items-center gap-2">
          <Check size={20} />
          {message}
        </p>
      )}
    </>
  );
}
