"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { newVerification } from "@/actions/authActions";
import { BadgeCheck, TriangleAlert } from "lucide-react";
import { LoadingSpinner } from "@/components/LoadingComponents";

export default function NewVerificationForm() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (success || error) return;

    if (!token) {
      setError("Missing token!");

      return;
    }

    newVerification(token)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => {
        setError("Something went wrong!");
      });
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
  }, []);

  return (
    <div className='h-screen w-full flex flex-col items-center justify-center gap-y-4'>
      {!success && !error ? (
        <LoadingSpinner />
      ) : (
        <>
          {success && (
            <div className='bg-emerald-500/15 text-emerald-500 p-2 flex gap-2 items-center'>
              <BadgeCheck className='h-6 w-6' />
              <p>{success}</p>
            </div>
          )}
          {error && !success && (
            <div className='bg-destructive/15 text-destructive p-2 flex gap-2 items-center'>
              <TriangleAlert className='h-6 w-6' />
              <p>{error}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
