import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { InputProps } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { memo } from "react";

interface CustomFormInputProps extends InputProps {
  label: string;
  control: any;
  inputName: string;
  formMessage?: string;
}

function CustomTextArea({
  control,
  label,
  inputName,
  disabled = false,
  required = true,
  type = "text",
  placeholder,
  autoComplete,
  formMessage,
}: CustomFormInputProps) {
  return (
    <div>
      <div className="my-4"></div>
      <FormField
        control={control}
        name={inputName}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-lg">{label} : </FormLabel>
            <FormControl>
              <Textarea
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                {...field}
                autoComplete={autoComplete}
              />
            </FormControl>
            {formMessage && (
              <FormMessage className="text-zinc-400">{formMessage}</FormMessage>
            )}
          </FormItem>
        )}
      />
    </div>
  );
}

export default memo(CustomTextArea);
