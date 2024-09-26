"use client";

import dynamic from "next/dynamic";
import { CardContent, CardFooter } from "@/components/ui/card";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { memo, useCallback, useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import axios from "axios";
import { useRouter } from "next/navigation";
import { verifyPeople } from "@/helpers/db";
import CreatePeopleSchema from "@/schema/CreatePeopleSchema";

const CustomFormInput = dynamic(() => import("./CustomFormInput"));

const SignUpFormValue = [
  {
    label: "User Email",
    inputName: "email",
    type: "email",
    placeholder: "Enter an email",
    autoComplete: "email",
  },
  {
    label: "Password",
    inputName: "password",
    type: "password",
    placeholder: "Create a password",
    autoComplete: "password",
  },
  {
    label: "Email Otp",
    inputName: "emailOtp",
    type: "number",
    placeholder: "Otp has sent to your email address",
    autoComplete: "email",
  },
];

function SignUpForm() {
  const [isUserExist, setIsUserExist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  let form = useForm<z.infer<typeof CreatePeopleSchema>>({
    resolver: zodResolver(CreatePeopleSchema),
    defaultValues: {
      email: "",
      password: "",
      emailOtp: "",
    },
  });

  const onSubmit = useCallback(
    async (values: z.infer<typeof CreatePeopleSchema>) => {
      try {
        const { data } = await axios.post(
          `/api/v1/sign-up?type=people`,
          values
        );
        if (data.success) {
          router.push("/sign-in");
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
    },
    []
  );

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

  const methodForVerifyButton = useCallback(async () => {
    const email = form.getValues("email");
    if (email) {
      setIsLoading(true);
      try {
        const data = await verifyPeople({ email, type: "people" });
        if (data.success) {
          setIsUserExist(true);
          toast({
            title: "Success",
            description: data.message,
          });
        } else {
          toast({
            title: "Error",
            description: data.message,
          });
          form.reset();
        }
      } catch (err) {
        form.reset();
      }
      setIsLoading(false);
    }
  }, []);

  return (
    <>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {SignUpFormValue.map((e) => (
              <CustomFormInput
                key={e.label}
                control={form.control}
                inputName={e.inputName}
                label={e.label}
                type={e.type}
                placeholder={e.placeholder}
                disabled={
                  isUserExist
                    ? e.inputName === "email"
                    : e.inputName !== "email"
                }
                autoComplete={e.autoComplete}
              />
            ))}

            {isUserExist && (
              <Button size="lg" className="text-lg mt-8">
                {form.formState.isSubmitting ? (
                  <Loader2 className="size-6 animate-spin" />
                ) : (
                  "Submit"
                )}
              </Button>
            )}
          </form>
          {!isUserExist && (
            <Button
              size="lg"
              className="text-lg mt-8"
              onClick={methodForVerifyButton}
            >
              {form.formState.isSubmitting || isLoading ? (
                <Loader2 className="size-6 animate-spin" />
              ) : (
                "Verify"
              )}
            </Button>
          )}
        </Form>
      </CardContent>
      <CardFooter className="text-zinc-600 text-base">
        Give the email that you have provided to the church and write a strong
        password minimum 6 characters.
      </CardFooter>
      <Toaster />
    </>
  );
}

export default memo(SignUpForm);
