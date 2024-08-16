"use client";

import { RegisterSchema } from "@/schemas";
import { z } from "zod";

import { Input } from "@/components/ui/input";

import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
import { register } from "@/actions/authActions";
import { useTransition, useState } from "react";

import { BadgeCheck, TriangleAlert } from "lucide-react";

export default function RegisterForm() {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof RegisterSchema>) {
    setError("");
    setSuccess("");

    startTransition(() => {
      register(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
      });
    });
  }

  return (
    <div className='flex flex-col w-full sm:w-[75%] md:w[60%] lg:w-[50%] border-[1px] border-primary/20 p-4 rounded-md overflow-auto'>
      <PageHeader label='Create new user' />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-4 grid grid-cols-1 gap-4'
        >
          <div className='space-y-2'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='text'
                      placeholder='Enter your name'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='email'
                      placeholder='Enter your email'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                      placeholder='Enter your password'
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
            Register new user
          </Button>
        </form>
      </Form>

      <div className='text-center pt-4'>
        <Link
          href='/auth/login'
          className='text-sm hover:underline text-center'
        >
          Already have an account? Sign in now.
        </Link>
      </div>
    </div>
  );
}
