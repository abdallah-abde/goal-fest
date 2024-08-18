import { CircleX } from "lucide-react";

export default function ErrorPage() {
  return (
    <div className='h-screen w-full flex flex-col items-center justify-center gap-y-4 text-destructive'>
      <CircleX className='font-bold text-2xl size-28' />
      <p className='font-bold text-2xl'>Something went wrong!</p>
    </div>
  );
}
