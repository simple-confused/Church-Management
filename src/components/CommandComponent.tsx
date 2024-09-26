"use client";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { getPeopleSearchInfo } from "@/helpers/db";
import axios from "axios";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { memo, useCallback, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

interface PeopleItemValue {
  name: string;
  _id: string;
  image: string;
}

interface Props {
  pathName: string;
}

function CommandComponent({ pathName }: Props) {
  const [open, setOpen] = useState(false);
  const [people, setPeople] = useState<PeopleItemValue[]>([]);
  const navigate = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const debounced = useDebouncedCallback(async (value) => {
    try {
      if (pathName === "/people") {
        const data = await getPeopleSearchInfo(value);
        if (data.success) {
          setPeople(data.data);
        }
      } else if (pathName === "/dashboard") {
        const { data } = await axios.get(
          `/api/v1/search-church?churchName=${value}`
        );

        if (data.success) {
          setPeople(data.data);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }, 500);
  // console.log(people);

  const onCommandItemOnclick = useCallback(async (_id: string) => {
    if (pathName === "/people" && _id) {
      navigate.push(`/people/${_id}`);
    } else if (pathName === "/dashboard" && _id) {
      try {
        const { data } = await axios.post(`/api/v1/dashboard`, {
          _id,
        });
        if (data.success) {
          window.location.reload();
        }
      } catch (err) {
        console.log(err);
      }
    }
  }, []);

  return (
    <>
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="group px-2 py-1 cursor-pointer border border-zinc-500 rounded-md flex items-center justify-between gap-x-2 w-full"
      >
        <div className="flex items-center justify-center gap-x-2 text-zinc-400 group-hover:text-zinc-200">
          <Search className="size-4 " />
          <h1 className="font-semibold max-w-max text-sm transition">
            Search {pathName === "/dashboard" ? " Church" : " People"}
          </h1>
        </div>
        <kbd className="text-muted-foreground font-mono font-medium bg-muted border rounded px-2 flex items-center justify-center">
          <span className="text-xs">CTRL+</span>K
        </kbd>
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder={`Type to search ${
            pathName === "/dashboard" ? " Church" : " People"
          }`}
          onValueChange={(e) => debounced(e)}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {people.length ? (
            <CommandGroup heading="Suggestions">
              {people.map(({ _id, name }) => (
                <CommandItem
                  key={_id}
                  onClickCapture={() => onCommandItemOnclick(_id)}
                >
                  {name}
                </CommandItem>
              ))}
            </CommandGroup>
          ) : (
            <></>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}

export default memo(CommandComponent);
