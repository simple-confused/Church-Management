import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { InputProps } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { memo } from "react";

interface CustomSelectInputProps extends InputProps {
  label: string;
  control: any;
  inputName: string;
  formMessage?: string;
  items: {
    value: string;
    label: string;
  }[];
  triggerClass?: string;
}

function CustomSelectInput({
  control,
  label,
  inputName,
  disabled = false,
  required = true,
  placeholder,
  formMessage,
  items,
  triggerClass,
}: CustomSelectInputProps) {
  return (
    <div>
      <div className="my-4"></div>
      <FormField
        control={control}
        name={inputName}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-lg">{label} : </FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={disabled}
              required={required}
            >
              <FormControl>
                <SelectTrigger className={triggerClass}>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="max-h-[300px]">
                {items.map(({ label, value }) => (
                  <SelectItem value={value} key={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formMessage && (
              <FormMessage className="text-zinc-400">{formMessage}</FormMessage>
            )}
          </FormItem>
        )}
      />
    </div>
  );
}

export default memo(CustomSelectInput);
