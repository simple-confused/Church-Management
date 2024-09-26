"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo } from "react";

interface NavigationMenuComponentValue {
  Pages: {
    title: string;
    path: string;
  }[];
}

function NavigationMenuComponent({ Pages }: NavigationMenuComponentValue) {
  const pathName = usePathname();
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {Pages.map((page) => (
          <NavigationMenuItem key={page.path}>
            <Link href={page.path} legacyBehavior passHref>
              <NavigationMenuLink
                className={cn(
                  "bg-slate-900 text-lg px-4 py-2 rounded-md text-zinc-200 hover:text-white hover:bg-slate-950 transition mx-2 flex flex-col",
                  pathName === page.path && "text-white bg-slate-950"
                )}
              >
                {page.title}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default memo(NavigationMenuComponent);
