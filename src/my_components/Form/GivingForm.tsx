"use client";

import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { memo, useCallback, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useDebouncedCallback } from "use-debounce";
import { createCashPayment, getPeopleSearchInfo } from "@/helpers/db";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

interface PeopleItemValue {
  name: string;
  _id: string;
  image: string;
}

const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;

function GivingForm() {
  const [people, setPeople] = useState<PeopleItemValue[]>([]);
  const [selectedPeople, setSelectedPeople] = useState<PeopleItemValue | null>(
    null
  );
  const [amount, setAmount] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = useCallback(async () => {
    try {
      if (selectedPeople) {
        setIsLoading(true);
        console.log({ selectedPeople, amount });
        if (amount && selectedPeople._id) {
          const data = await createCashPayment({
            amount: amount,
            userId: selectedPeople._id,
          });
          if (data.success) {
            setSelectedPeople(null);
            setAmount(undefined);
          } else {
            console.log(data);
            toast({
              title: "Error",
              description: data.message,
            });
          }
        }
        setIsLoading(false);
      }
    } catch (err: any) {
      console.log(err);
      toast({
        title: "Error",
        description: err?.response?.data?.message,
      });
      setIsLoading(false);
    }
  }, [selectedPeople, amount]);

  const debounced = useDebouncedCallback(async (value) => {
    const data = await getPeopleSearchInfo(value);
    if (data.success) {
      setPeople(data.data);
    }
  }, 500);

  return (
    <div>
      {selectedPeople ? (
        <div>
          <h1>Selected People :</h1>
          <div className="w-full p-2 flex items-center justify-center gap-2 my-2">
            <div
              key={selectedPeople._id}
              className="flex items-center justify-between px-3 py-1 gap-x-3 border rounded-md"
            >
              <Avatar>
                <AvatarImage src={`${imageUrl}/${selectedPeople.image}`} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <h1>{selectedPeople.name}</h1>
              <X
                onClick={() => setSelectedPeople(null)}
                className="size-6 text-zinc-700 hover:text-black transition cursor-pointer"
              />
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      {!selectedPeople?._id && (
        <Command className="w-1/2 mx-auto">
          <CommandInput
            placeholder="Type a command or search..."
            onValueChange={(e) => debounced(e)}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {people.map(
                ({ _id, image, name }) =>
                  _id !== selectedPeople?._id && (
                    <CommandItem
                      key={_id}
                      className="flex items-center"
                      onSelect={() => {
                        setSelectedPeople({ _id, image, name });
                        setPeople([]);
                      }}
                    >
                      {name}
                    </CommandItem>
                  )
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      )}

      <Input
        type="number"
        placeholder="Enter a amount"
        required
        name="amount"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />

      <Button
        variant="secondary"
        size="lg"
        className="text-lg mt-8"
        onClick={onSubmit}
      >
        {isLoading ? <Loader2 className="size-6 animate-spin" /> : "Submit"}
      </Button>
    </div>
  );
}

export default memo(GivingForm);
