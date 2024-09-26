"use client";

import { CardContent, CardFooter } from "@/components/ui/card";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";
import { memo, useCallback, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import SignInSchema from "@/schema/SignInSchema";
import CustomFormInput from "./CustomFormInput";
import axios from "axios";
import { useRouter } from "next/navigation";

const SignInFormValue = [
  {
    label: "Church Email",
    inputName: "email",
    type: "email",
    placeholder: "Enter an email",
    autoComplete: "email",
  },
  {
    label: "Password",
    inputName: "password",
    type: "password",
    placeholder: "Enter a password",
    autoComplete: "password",
  },
];

function SigninForm() {
  const router = useRouter();
  let form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = useCallback(async (values: z.infer<typeof SignInSchema>) => {
    try {
      const { data } = await axios.post("/api/v1/sign-in", values);
      if (data.success) {
        router.push("/dashboard");
      } else {
        toast({
          title: "Error",
          description: data.message,
        });
        form.reset();
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.message,
      });
      form.reset();
    }
  }, []);

  const methodForUseEffect = useCallback(() => {
    const error = form.formState.errors;

    if (error) {
      if (error.email?.message) {
        toast({
          title: "Error in email field",
          description: error.email?.message,
        });
      } else if (error.password?.message) {
        toast({
          title: "Error in password field",
          description: error.password?.message,
        });
      }
    }
  }, [form.formState.errors]);

  useEffect(methodForUseEffect, [form.formState.errors]);

  return (
    <>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {SignInFormValue.map((e) => (
              <CustomFormInput
                key={e.label}
                control={form.control}
                inputName={e.inputName}
                label={e.label}
                type={e.type}
                placeholder={e.placeholder}
                disabled={form.formState.isSubmitting}
                autoComplete={e.autoComplete}
              />
            ))}

            <Button size="lg" className="text-lg mt-8">
              {form.formState.isSubmitting ? (
                <Loader2 className="size-6 animate-spin" />
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-center justify-end  text-base md:text-lg gap-x-2">
          Create Account.
          <Link
            href="/sign-up"
            className="transition font-semibold text-lg md:text-xl text-slate-700 hover:text-black hover:underline"
          >
            As Church
          </Link>
          /
          <Link
            href="/sign-up/people"
            className="transition font-semibold text-lg md:text-xl text-slate-700 hover:text-black hover:underline"
          >
            As Visitor
          </Link>
        </div>
      </CardFooter>
      <Toaster />
    </>
  );
}

export default memo(SigninForm);
