import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { usePeopleContext } from "@/my_components/providers/PeopleProvider";
import { Check } from "lucide-react";
import { memo } from "react";

const GenderOptions = [
  {
    name: "Male",
    value: "male",
  },
  {
    name: "Female",
    value: "female",
  },
  {
    name: "Others",
    value: "others",
  },
];

function PeopleFilterOptions() {
  const { filterOptions, setFilterOptions } = usePeopleContext();
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Filter</MenubarTrigger>
        <MenubarContent>
          <MenubarSub>
            <MenubarSubTrigger>Gender</MenubarSubTrigger>
            <MenubarSubContent>
              {GenderOptions.map(({ name, value }) => (
                <MenubarItem
                  key={value}
                  onClick={() =>
                    setFilterOptions((prev: any) => ({
                      ...prev,
                      gender: value,
                    }))
                  }
                >
                  {filterOptions.gender === value && (
                    <Check className="size-4 text-zinc-300 mr-4" />
                  )}
                  {name}
                </MenubarItem>
              ))}
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>Order</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

export default memo(PeopleFilterOptions);
