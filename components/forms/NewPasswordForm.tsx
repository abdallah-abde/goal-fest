"use client";

import { NewPasswordSchema } from "@/schemas";
import { z } from "zod";

import { Input } from "@/components/ui/input";

import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { newPassword } from "@/actions/authActions";
import { useTransition, useState } from "react";
import { BadgeCheck, TriangleAlert } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function NewPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof NewPasswordSchema>) {
    setError("");
    setSuccess("");

    startTransition(() => {
      newPassword(values, token).then((data) => {
        if (data) {
          setError(data.error ? data.error : "");
          setSuccess(data.success ? data.success : "");
        }
      });
    });
  }

  return (
    <div className='h-screen w-full flex flex-col items-center justify-center gap-y-4'>
      <div className='flex flex-col w-full sm:w-[75%] md:w[60%] lg:w-[50%] border-[1px] border-primary/20 p-4 rounded-md'>
        <PageHeader label='Enter a new password' />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4 grid grid-cols-1 gap-4 mb-2'
          >
            <div className='space-y-2'>
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type='password'
                        placeholder='Enter your new password'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {success && (
              <div className='bg-emerald-500/15 text-emerald-500 p-2 flex gap-2 items-center'>
                <BadgeCheck className='h-6 w-6' />
                <p>{success}</p>
              </div>
            )}
            {error && (
              <div className='bg-destructive/15 text-destructive p-2 flex gap-2 items-center'>
                <TriangleAlert className='h-6 w-6' />
                <p>{error}</p>
              </div>
            )}
            <Button
              type='submit'
              className='w-full font-bold'
              size='lg'
              disabled={isPending}
            >
              Reset password
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
