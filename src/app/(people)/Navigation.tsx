import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { memo } from "react";

const MenuList = [
  {
    title: "Information",
    path: "/",
  },
  {
    title: "Attendance",
    path: "/attendance",
  },
  {
    title: "Payments",
    path: "/payments",
  },
];

function Navigation({ pathName }: { pathName: String }) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {MenuList.map(({ path, title }) => (
          <NavigationMenuItem key={path}>
            <Link href={`${pathName}${path}`} legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                {title}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default memo(Navigation);
