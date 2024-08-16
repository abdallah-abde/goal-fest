"use client"; // Error components must be Client Components

import { useEffect } from "react";
import { CircleX } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className='h-full w-full flex flex-col items-center justify-center gap-y-4 text-destructive'>
      <CircleX className='font-bold text-2xl size-28' />
      <p className='font-bold text-2xl'>Something went wrong!</p>
      {/* <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button> */}
    </div>
  );
}
