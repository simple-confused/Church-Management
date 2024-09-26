"use client";

import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { memo, useCallback, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useDebouncedCallback } from "use-debounce";
import { getPeopleSearchInfo, insertPeopleToTag } from "@/helpers/db";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePeopleContext } from "../providers/PeopleProvider";

interface PeopleItemValue {
  name: string;
  _id: string;
  image: string;
}

const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;

function InsertUserToTagForm() {
  const router = useRouter();
  const { tagId }: { tagId: string } = useParams();
  const { peopleInfo } = usePeopleContext();
  const [people, setPeople] = useState<PeopleItemValue[]>([]);
  const [selectedPeople, setSelectedPeople] = useState<PeopleItemValue[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = useCallback(async () => {
    try {
      if (selectedPeople?.length) {
        setIsLoading(true);
        const newArr = selectedPeople.map(({ _id }) => ({ _id }));
        const data = await insertPeopleToTag(newArr, tagId);
        if (data.success) {
          router.refresh();
        } else {
          toast({
            title: "Error",
            description: data.message,
          });
        }
        setIsLoading(false);
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.message,
      });
    }
  }, [selectedPeople]);

  const debounced = useDebouncedCallback(async (value) => {
    const data = await getPeopleSearchInfo(value);
    if (data.success) {
      if (peopleInfo.length) {
        const peopleArray = data.data.filter((e: any) =>
          Boolean(peopleInfo.find((p: any) => e._id !== p._id))
        );
        setPeople(peopleArray);
      } else {
        setPeople(data.data);
      }
    }
  }, 500);

  const removeSelectedPeople = useCallback(
    async (removeId: string) => {
      const removedPeople =
        selectedPeople.find(({ _id }) => _id === removeId) || null;
      setSelectedPeople((prev) => prev.filter(({ _id }) => _id !== removeId));
      if (removedPeople) {
        setPeople((prev) => [...prev, removedPeople]);
      }
    },
    [selectedPeople]
  );

  return (
    <div>
      {selectedPeople?.length ? (
        <div>
          <h1>Selected People :</h1>
          <div className="w-full p-2 flex items-center justify-center gap-2 flex-wrap">
            {selectedPeople.map(({ _id, image, name }) => (
              <div
                key={_id}
                className="flex items-center justify-between px-3 py-1 gap-x-3 border rounded-md"
              >
                <Avatar>
                  <AvatarImage src={`${imageUrl}/${image}`} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1>{name}</h1>
                <X
                  onClick={() => removeSelectedPeople(_id)}
                  className="size-6 text-zinc-500 hover:text-zinc-700 transition cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <></>
      )}
      <Command className="h-[200px]">
        <CommandInput
          placeholder="Type a command or search..."
          onValueChange={(e) => debounced(e)}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {people.map(({ _id, image, name }) => (
              <CommandItem
                key={_id}
                className="flex items-center"
                onSelect={() => {
                  setSelectedPeople((prev) => [...prev, { _id, image, name }]);
                  setPeople((prev) => prev.filter(({ _id: id }) => id !== _id));
                }}
              >
                {name}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>

      <Button size="lg" className="text-lg mt-8" onClick={onSubmit}>
        {isLoading ? <Loader2 className="size-6 animate-spin" /> : "Submit"}
      </Button>
    </div>
  );
}

export default memo(InsertUserToTagForm);
