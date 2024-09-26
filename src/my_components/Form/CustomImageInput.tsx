import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  memo,
  useCallback,
} from "react";

interface CustomImageInputProps {
  setIsImageLoading: Dispatch<SetStateAction<boolean>>;
  setIsUploadedImage: Dispatch<SetStateAction<string>>;
  control: any;
  type: "sign-up" | "people";
}

function CustomImageInput({
  control,
  setIsImageLoading,
  setIsUploadedImage,
  type,
}: CustomImageInputProps) {
  const uploadImage = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const image = e.target.files;
    if (image?.length) {
      setIsImageLoading(true);
      const { public_id } = await (
        await import("@/lib/Cloudinary")
      ).uploadCloudinary(image, type);
      if (public_id) {
        setIsUploadedImage(public_id);
        setIsImageLoading(false);
      }
    }
  }, []);

  return (
    <div>
      <div className="my-4"></div>
      <FormField
        control={control}
        name="input"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-lg">Upload Image : </FormLabel>
            <FormControl>
              <Input
                type="file"
                //TODO: Add accept="image/*" to accept only images
                // required
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  uploadImage(e);
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}

export default memo(CustomImageInput);
