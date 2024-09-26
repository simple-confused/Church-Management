"use client";

import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { memo, useState } from "react";
import { FormControl, FormField, FormItem, FormLabel } from "./ui/form";

interface CustomComboBoxProps {
  options:
    | {
        _id: string;
        name: string;
      }[]
    | undefined;

  placeholder: string;
  placeholderForEmptyValue: string;
  control: any;
  inputName: string;
  label: string;
  disabled: boolean;
}

function CustomComboBox({
  options,
  placeholder,
  placeholderForEmptyValue,
  control,
  inputName,
  label,
}: CustomComboBoxProps) {
  const [open, setOpen] = useState(false);
  return (
    <FormField
      control={control}
      name={inputName}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="mr-4">{label} : </FormLabel>
          <FormControl>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[200px] justify-between"
                >
                  {field.value
                    ? options?.find(({ _id }) => _id === field.value)?.name
                    : placeholder}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder={placeholder} />
                  <CommandList>
                    <CommandEmpty>{placeholderForEmptyValue}</CommandEmpty>
                    <CommandGroup>
                      {options?.length ? (
                        options?.map(({ _id, name }) => (
                          <CommandItem
                            key={_id}
                            value={name}
                            onSelect={() => {
                              field.onChange(_id);
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                field.value === _id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {name}
                          </CommandItem>
                        ))
                      ) : (
                        <></>
                      )}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </FormControl>
        </FormItem>
      )}
    />
  );
}

export default memo(CustomComboBox);
