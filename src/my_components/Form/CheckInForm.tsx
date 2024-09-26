"use client";

import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Loader2, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { memo, useCallback, useEffect, useState } from "react";
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
import { useDebouncedCallback } from "use-debounce";
import { createCashPayment, getPeopleSearchInfo } from "@/helpers/db";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { cn } from "@/lib/utils";

interface PeopleItemValue {
  name: string;
  _id: string;
  image: string;
}

interface EventInfoValue {
  _id: string;
  name: string;
}

const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;

function CheckInForm() {
  const [people, setPeople] = useState<PeopleItemValue[]>([]);
  const [selectedPeople, setSelectedPeople] = useState<PeopleItemValue | null>(
    null
  );
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [eventInfo, setEventInfo] = useState<EventInfoValue[] | null>([]);
  const [open, setOpen] = useState(false);
  const onSubmit = useCallback(async () => {
    try {
      if (selectedPeople) {
        setIsLoading(true);
        if (selectedPeople?._id) {
          const { data } = await axios.post(`/api/v1/check-in`, {
            peopleId: selectedPeople._id,
            eventId: selectedEvent,
          });
          console.log(data);
          if (data.success) {
            setSelectedPeople(null);
            setSelectedEvent(null);
            setEventInfo([]);
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
  }, [selectedPeople, selectedEvent]);

  const debounced = useDebouncedCallback(async (value) => {
    const data = await getPeopleSearchInfo(value);
    if (data.success) {
      setPeople(data.data);
    }
  }, 500);

  useEffect(() => {
    if (selectedPeople?._id) {
      try {
        const getPeopleEvent = async () => {
          const { data } = await axios.get(
            `/api/v1/check-in/events/${selectedPeople?._id}`
          );
          if (data.success) {
            setEventInfo(data.data.Events_Info);
            console.log(data.data.Events_Info);
          }
        };
        getPeopleEvent();
      } catch (err: any) {
        console.log(err);
      }
    }
  }, [selectedPeople]);

  return (
    <div className="flex flex-col items-start w-full">
      {selectedPeople ? (
        <div className="mx-auto flex items-center justify-between w-full">
          <h1>Selected People :</h1>
          <div className="p-2 flex items-center justify-center gap-2 my-2">
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
                onClick={() => {
                  setSelectedPeople(null);
                  setSelectedEvent(null);
                  setEventInfo(null);
                }}
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
            placeholder="Type people to search..."
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

      {eventInfo?.length ? (
        <div className="mx-auto flex items-center justify-between w-full">
          <h1 className="my-4">Events (optional) :</h1>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[200px] justify-between"
              >
                {selectedEvent
                  ? eventInfo?.find(({ _id }) => _id === selectedEvent)?.name
                  : "Select Event..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandList>
                  <CommandInput placeholder="Select Event..." />
                  <CommandEmpty>No Events found.</CommandEmpty>
                  <CommandGroup>
                    {eventInfo?.length ? (
                      eventInfo?.map(({ _id, name }) => (
                        <CommandItem
                          key={_id}
                          value={name}
                          onSelect={() => {
                            // setCommandInputValue(
                            //   commandInputValue === name ? "" : currentValue
                            // );
                            setSelectedEvent(_id);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedEvent === _id
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
        </div>
      ) : (
        <></>
      )}

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

export default memo(CheckInForm);
