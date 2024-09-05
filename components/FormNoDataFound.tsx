import { Ban } from "lucide-react";

export default function FormNoDataFound({ text }: { text: string }) {
  return (
    <div className='p-2 rounded-md w-full bg-destructive/10 text-destructive self-end text-sm flex gap-2 items-center'>
      <Ban size={20} />
      {text}
    </div>
  );
}
