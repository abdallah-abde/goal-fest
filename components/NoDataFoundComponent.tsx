import { Frown } from "lucide-react";

export default function NoDataFoundComponent({ message }: { message: string }) {
  return (
    <div className='h-full -mt-12 w-full flex flex-col items-center justify-center gap-y-4 text-red-500/90'>
      <Frown className='font-bold text-2xl size-28' />
      <p className='font-bold text-2xl'>{message}</p>
    </div>
  );
}
