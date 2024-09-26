import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomFormInput from "@/my_components/Form/CustomFormInput";
import CustomImageInput from "@/my_components/Form/CustomImageInput";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { memo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface Props {
  name: string;
  // image: string;
  razorpay_api_key?: string;
  razorpay_secret_key?: string;
}

const UpdateSchema = z.object({
  name: z.string(),
  razorpay_api_key: z.string().optional(),
  razorpay_secret_key: z.string().optional(),
  // image: z.string(),
});

const SignUpFormValue = [
  {
    label: "Church Name",
    inputName: "name",
    type: "text",
    placeholder: "Enter a name",
    autoComplete: "name",
  },
  {
    label: "Razorpay Api Key",
    inputName: "razorpay_api_key",
    type: "text",
    placeholder: "Enter a Razorpay Api Key",
    autoComplete: "razorpay_api_key",
  },
  {
    label: "Razorpay Api Secret",
    inputName: "razorpay_secret_key",
    type: "text",
    placeholder: "Enter a Razorpay Api Secret",
    autoComplete: "razorpay_secret_key",
  },
];

function ProfileFormChurch({
  name,
  razorpay_api_key,
  razorpay_secret_key,
}: Props) {
  const pathName = usePathname();
  const router = useRouter();
  // const [isUploadedImage, setIsUploadedImage] = useState(image || "");
  // const [isImageLoading, setIsImageLoading] = useState(false);
  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;

  let form = useForm<z.infer<typeof UpdateSchema>>({
    resolver: zodResolver(UpdateSchema),
    defaultValues: {
      name: name || "",
      razorpay_api_key: razorpay_api_key || "",
      razorpay_secret_key: razorpay_secret_key || "",
    },
  });
  const onSubmit = async (values: z.infer<typeof UpdateSchema>) => {
    try {
      const { data } = await axios.post("/api/v1/profile", values);
      if (data.success) {
        router.refresh();
      } else {
        console.log(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
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

        {/* {isImageLoading ? (
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
        )} */}

        <Button
          variant="secondary"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="text-lg mt-8"
        >
          {form.formState.isSubmitting ? (
            <Loader2 className="size-6 animate-spin" />
          ) : (
            "Update"
          )}
        </Button>
      </form>
    </Form>
  );
}

export default memo(ProfileFormChurch);
