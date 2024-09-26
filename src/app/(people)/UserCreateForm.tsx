"use client";

import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CreateUserSchema from "@/schema/CreateUserSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { memo, useCallback, useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { usePeopleContext } from "@/my_components/providers/PeopleProvider";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";

const CustomSelectImput = dynamic(
  () => import("@/my_components/Form/CustomSelectInput")
);
const CustomFormInput = dynamic(
  () => import("@/my_components/Form/CustomFormInput")
);
const CustomImageInput = dynamic(
  () => import("@/my_components/Form/CustomImageInput")
);
const CustomTextArea = dynamic(
  () => import("@/my_components/Form/CustomTextArea")
);

const CreateUserFormValue = [
  {
    label: "User Name",
    inputName: "name",
    type: "text",
    placeholder: "Enter a name",
    autoComplete: "name",
  },
  {
    label: "User Email",
    inputName: "email",
    type: "email",
    placeholder: "Enter an email",
    autoComplete: "email",
  },
  {
    label: "Phone Number",
    inputName: "phone_number",
    type: "number",
    placeholder: "Enter a ph no",
    autoComplete: "phone number",
  },
  {
    label: "Date Of Birth",
    inputName: "date_of_birth",
    type: "text",
    placeholder: "MM/DD/YYYY",
    autoComplete: "Date of birth",
  },
];

const itemsForSelectInput = [
  {
    label: "Male",
    value: "male",
  },
  {
    label: "Female",
    value: "female",
  },
  {
    label: "Others",
    value: "other",
  },
];

function UserCreateForm({ type }: { type: string | null | undefined }) {
  const { setIsFormError, peopleInfo } = usePeopleContext();
  const router = useRouter();
  const [isUploadedImage, setIsUploadedImage] = useState(
    peopleInfo.image || ""
  );
  const [isImageLoading, setIsImageLoading] = useState(false);
  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;
  const form = useForm<z.infer<typeof CreateUserSchema>>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      name: peopleInfo.name || "",
      email: peopleInfo.email || "",
      phone_number: peopleInfo.phone_number || "",
      gender: peopleInfo.gender || "",
      address: peopleInfo.address || "",
      date_of_birth: peopleInfo.date_of_birth || "",
      image: peopleInfo.image || "",
    },
  });
  const onSubmit = useCallback(
    async (values: z.infer<typeof CreateUserSchema>) => {
      values.image = isUploadedImage;
      try {
        if (peopleInfo._id) {
          const { data } = await axios.patch(
            `/api/v1/people?peopleId=${peopleInfo._id}`,
            values
          );
          if (data.success) {
            router.refresh();
          } else {
            setIsFormError(true);
            toast({
              title: "Error",
              description: data.message,
            });
          }
        } else {
          const { data } = await axios.post("/api/v1/people", values);
          if (data.success) {
            router.refresh();
          } else {
            setIsFormError(true);
            toast({
              title: "Error",
              description: data.message,
            });
            form.reset();
          }
        }
      } catch (err: any) {
        setIsFormError(true);
        toast({
          title: "Error",
          description: err.message,
        });
        form.reset();
      }
    },
    [isUploadedImage]
  );

  const methodForUseEffect = useCallback(() => {
    const error = form.formState.errors;
    Object.values(error).forEach((value) => {
      if (value?.message) {
        setIsFormError(true);
      }
      toast({
        title: "Error",
        description: value.message,
      });
    });
  }, [form.formState.errors]);

  useEffect(methodForUseEffect, [form.formState.errors]);

  return (
    <ScrollArea>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-h-[80dvh] px-6"
        >
          {type === "edit"
            ? CreateUserFormValue.map(
                ({ autoComplete, inputName, label, placeholder, type }) =>
                  inputName !== "email" &&
                  inputName !== "phone_number" && (
                    <CustomFormInput
                      key={inputName}
                      control={form.control}
                      inputName={inputName}
                      label={label}
                      type={type}
                      placeholder={placeholder}
                      disabled={form.formState.isSubmitting}
                      autoComplete={autoComplete}
                    />
                  )
              )
            : CreateUserFormValue.map(
                ({ autoComplete, inputName, label, placeholder, type }) => (
                  <CustomFormInput
                    key={inputName}
                    control={form.control}
                    inputName={inputName}
                    label={label}
                    type={type}
                    placeholder={placeholder}
                    disabled={form.formState.isSubmitting}
                    autoComplete={autoComplete}
                  />
                )
              )}
          <CustomSelectImput
            control={form.control}
            inputName="gender"
            label="Gender"
            placeholder="Gender"
            items={itemsForSelectInput}
          />

          <CustomTextArea
            control={form.control}
            inputName="address"
            label="Enter the address"
            placeholder="Enter the address"
          />

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
              type="people"
              control={form.control}
              setIsImageLoading={setIsImageLoading}
              setIsUploadedImage={setIsUploadedImage}
            />
          )}

          <Button
            className="text-lg mt-4"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="size-6 animate-spin" />
            ) : peopleInfo?.name ? (
              "Update"
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </Form>
    </ScrollArea>
  );
}

export default memo(UserCreateForm);
