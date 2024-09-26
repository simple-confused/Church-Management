"use client";

import dynamic from "next/dynamic";
import { CardContent } from "@/components/ui/card";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/components/ui/use-toast";
import { memo, useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import SignUpSchema from "@/schema/SignUpSchema";
import axios from "axios";

const CustomFormInput = dynamic(() => import("./CustomFormInput"));
const CustomImageInput = dynamic(() => import("./CustomImageInput"));

const SignUpFormValue = [
  {
    label: "Church Name",
    inputName: "name",
    type: "text",
    placeholder: "Enter a name",
    autoComplete: "name",
  },
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

function SignupForm() {
  const pathName = usePathname();
  const router = useRouter();
  const [isUploadedImage, setIsUploadedImage] = useState("");
  const [isImageLoading, setIsImageLoading] = useState(false);
  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;

  let form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      image: "",
    },
  });

  let onSubmit = useCallback(
    async (values: z.infer<typeof SignUpSchema>) => {
      values.image = isUploadedImage;
      try {
        const { data } = await axios.post(
          `/api/v1/sign-up?type=${
            pathName.includes("/admin") ? "admin" : "owner"
          }`,
          values
        );
        if (data.success) {
          router.push(
            `/sign-up/${data.data._id}/verify-email?type=${data.data.type}`
          );
        } else {
          toast({
            title: "Error",
            description: data?.message,
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
    [isUploadedImage]
  );

  const methodForUseEffect = useCallback(() => {
    const error = form.formState.errors;
    if (error) {
      if (error.name) {
        toast({
          title: "Error in Church Name field",
          description: error.name.message,
        });
      } else if (error.email) {
        toast({
          title: "Error in Church Email field",
          description: error.email.message,
        });
      } else if (error.password) {
        toast({
          title: "Error in Password field",
          description: error.password.message,
        });
      } else if (error.image) {
        toast({
          title: "Error in Upload Image field",
          description: error.image.message,
        });
      }
    }
  }, [form.formState.errors]);

  useEffect(methodForUseEffect, [form.formState.errors]);

  return (
    <CardContent>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {SignUpFormValue.map((e) => (
            <CustomFormInput
              key={e.label}
              control={form.control}
              inputName={e.inputName}
              label={
                pathName.includes("/admin")
                  ? e.label.replaceAll("Church", "Admin")
                  : e.label
              }
              type={e.type}
              placeholder={e.placeholder}
              disabled={form.formState.isSubmitting}
              autoComplete={e.autoComplete}
            />
          ))}

          {isImageLoading ? (
            <div className="w-full flex items-center justify-center mt-4 h-10">
              <Loader2 className="size-8 animate-spin" />
            </div>
          ) : isUploadedImage ? (
            <div className="mt-4 flex items-center justify-center">
              <img
                src={`${imageUrl}/w_250/q_35/f_auto/${isUploadedImage}`}
                className="size-24 rounded-full object-cover"
                alt="uploaded image"
              />
            </div>
          ) : (
            <CustomImageInput
              type="sign-up"
              control={form.control}
              setIsImageLoading={setIsImageLoading}
              setIsUploadedImage={setIsUploadedImage}
            />
          )}

          <Button
            size="lg"
            disabled={form.formState.isSubmitting || isImageLoading}
            className="text-lg mt-8"
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="size-6 animate-spin" />
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </Form>
      <Toaster />
    </CardContent>
  );
}
export default memo(SignupForm);
