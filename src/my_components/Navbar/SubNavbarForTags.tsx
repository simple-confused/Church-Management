"use client";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import Link from "next/link";
import { memo } from "react";

interface ItemValue {
  name: string;
  _id: string;
}

interface SubNavbarForTagsProps {
  menu: {
    type: "auto" | "tag" | "group";
    trigger: string;
    items?: ItemValue[];
    SubItems?: {
      name: string;
      SubItem: ItemValue[];
    }[];
  }[];
}

function SubNavbarForTags({ menu }: SubNavbarForTagsProps) {
  return (
    <Menubar>
      {menu.map(({ items, type, trigger, SubItems }) =>
        type !== "group" ? (
          <MenubarMenu key={trigger}>
            <MenubarTrigger className="cursor-pointer">
              {trigger}
            </MenubarTrigger>
            <MenubarContent>
              {items?.map(
                ({ name, _id }) =>
                  name &&
                  _id && (
                    <MenubarItem key={_id}>
                      <Link href={`/tags/${_id}`}>{name}</Link>
                    </MenubarItem>
                  )
              )}
            </MenubarContent>
          </MenubarMenu>
        ) : (
          <MenubarMenu key={trigger}>
            <MenubarTrigger className="cursor-pointer">
              {trigger}
            </MenubarTrigger>
            <MenubarContent>
              {SubItems?.map(({ SubItem, name }) => (
                <MenubarSub key={name}>
                  <MenubarSubTrigger>{name}</MenubarSubTrigger>
                  <MenubarSubContent>
                    {SubItem?.map(({ name, _id }) => (
                      <MenubarItem key={_id}>
                        <Link href={`/tags/${_id}`}>{name}</Link>
                      </MenubarItem>
                    ))}
                  </MenubarSubContent>
                </MenubarSub>
              ))}
            </MenubarContent>
          </MenubarMenu>
        )
      )}
    </Menubar>
  );
}

export default memo(SubNavbarForTags);
