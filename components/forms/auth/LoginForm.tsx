"use client";

import { LoginSchema } from "@/schemas";
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
import { login } from "@/actions/authActions";
import { useTransition, useState } from "react";
import { signIn } from "next-auth/react";
import { BadgeCheck, TriangleAlert, Github } from "lucide-react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export default function LoginForm() {
  const [showTwoFactor, setShowTwoFactor] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });

  function onSubmit(values: z.infer<typeof LoginSchema>) {
    setError("");
    setSuccess("");

    startTransition(() => {
      login(values)
        .then((data) => {
          if (data?.error) {
            // form.reset();
            setError(data.error);
          }

          if (data?.success) {
            // form.reset();
            setSuccess(data.success);
          }

          if (data?.twoFactor) {
            setShowTwoFactor(true);
          }
        })
        .catch(() => setError("Something went wrong"));
    });
  }

  function onClick() {
    signIn("github", {
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
    });
  }

  return (
    <div className="flex flex-col w-full sm:w-[75%] md:w[60%] lg:w-[50%] border-[1px] border-primary/20 p-4 rounded-md overflow-auto">
      <PageHeader label="Welcome back" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 grid grid-cols-1 gap-4 mb-4"
        >
          <div className="space-y-2">
            {showTwoFactor && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Two Factor Code</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="123456" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {!showTwoFactor && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="Enter your login email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="Enter your login password"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
          {success && (
            <div className="bg-emerald-500/15 text-emerald-500 p-2 flex gap-2 items-center">
              <BadgeCheck className="h-6 w-6" />
              <p>{success}</p>
            </div>
          )}
          {error && (
            <div className="bg-destructive/15 text-destructive p-2 flex gap-2 items-center">
              <TriangleAlert className="h-6 w-6" />
              <p>{error}</p>
            </div>
          )}
          <Button
            type="submit"
            className="w-full font-bold"
            size="lg"
            disabled={isPending}
          >
            {showTwoFactor ? "Confirm" : "Login"}
          </Button>
        </form>
      </Form>
      <Button onClick={onClick}>
        <Github className="mr-2" /> Sign in with Github
      </Button>

      <div className="text-center pt-4 px-2 flex justify-between">
        <Link
          href="/auth/register"
          className="text-sm hover:underline text-center"
        >
          Don&#39;t have an account? Sign up now.
        </Link>
        <Link
          href="/auth/reset"
          className="text-sm hover:underline text-center"
        >
          Forgot Password?
        </Link>
      </div>
    </div>
  );
}
