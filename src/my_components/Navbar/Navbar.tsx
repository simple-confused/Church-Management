"use client";

import NavigationMenuComponent from "@/components/NavigationMenuComponent";
import { LogOut } from "lucide-react";
import { memo } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import axios from "axios";

const CommandComponent = dynamic(() => import("@/components/CommandComponent"));
const TooltipComponent = dynamic(() => import("@/components/TooltipComponent"));
const SheetComponent = dynamic(() => import("@/components/SheetComponent"));

interface UserInfoValue {
  name: string;
  imageUrl: string;
  role: string;
}

const AdminPages = [
  {
    title: "Dashboard",
    path: "/dashboard",
  },
  {
    title: "People",
    path: "/people",
  },
  {
    title: "Tags",
    path: "/tags",
  },
  {
    title: "Events",
    path: "/events",
  },
];

const OwnerPages = [
  {
    title: "Dashboard",
    path: "/dashboard",
  },
  {
    title: "People",
    path: "/people",
  },
  {
    title: "Tags",
    path: "/tags",
  },
  {
    title: "Events",
    path: "/events",
  },
  {
    title: "Giving",
    path: "/giving",
  },
  {
    title: "Check In",
    path: "/check-in",
  },
];

const Pages = [
  {
    title: "Dashboard",
    path: "/dashboard",
  },
  {
    title: "Tags",
    path: "/tags",
  },
  {
    title: "Events",
    path: "/events",
  },
  {
    title: "Online Giving",
    path: "/online-giving",
  },
];

const onSignOutButtonClick = async () => {
  try {
    const { data } = await axios.delete("/api/v1/sign-in");
    if (data.success) {
      window.location.href = "/sign-in";
    }
  } catch (err: any) {
    console.log(err);
  }
};

function Navbar({ userInfo }: { userInfo: UserInfoValue }) {
  const pathname = usePathname();
  return (
    <div className="w-full fixed top-0 left-0 right-0 bg-slate-900 z-50">
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between py-4 px-2 gap-x-4 md:px-4">
        {/* Mobile Menu (visible on small screens) */}
        <div className="flex lg:hidden">
          <SheetComponent
            userInfo={userInfo}
            Pages={
              userInfo.role === "admin"
                ? AdminPages
                : userInfo.role === "owner"
                ? OwnerPages
                : Pages
            }
          />
        </div>

        {/* Brand or Logo */}
        <h1 className="text-slate-300 font-bold text-lg sm:text-xl tracking-wider sm:tracking-widest">
          XYZ
        </h1>

        {/* Desktop Navigation (visible on large screens) */}
        <div className="hidden lg:block">
          <NavigationMenuComponent
            Pages={
              userInfo.role === "admin"
                ? AdminPages
                : userInfo.role === "owner"
                ? OwnerPages
                : Pages
            }
          />
        </div>

        {/* Right Section (Profile, Commands) */}
        <div
          className={`flex items-center ${
            (pathname === "/people" && userInfo.role === "owner") ||
            ((pathname === "/people" || pathname === "/dashboard") &&
              userInfo.role === "admin" &&
              "max-w-[300px] w-[90%]")
          }`}
        >
          {/* Command Component Logic based on Path and Role */}
          {pathname === "/people" && userInfo.role === "owner" && (
            <CommandComponent pathName="/people" />
          )}
          {userInfo.role === "admin" &&
            (pathname === "/dashboard" || pathname === "/people") && (
              <CommandComponent pathName={pathname} />
            )}

          {/* Profile and Sign Out Section */}
          <TooltipComponent
            hoverElement={
              <img
                src={`${userInfo.imageUrl}`}
                alt={`${userInfo.name}'s profile picture`}
                className="w-10 h-10 rounded-full ml-4"
              />
            }
          >
            <div className="flex flex-col justify-center p-2">
              <div className="my-1">
                <h1 className="text-base font-semibold">{userInfo.name}</h1>
                <p className="text-sm text-slate-500 text-center">
                  {userInfo.role}
                </p>
              </div>
              <Link
                href="/profile"
                className="my-1 w-full rounded-md p-1 text-base text-center text-slate-700 hover:text-slate-950 hover:bg-slate-100"
              >
                Profile
              </Link>
              <Button
                size="sm"
                variant="link"
                className="flex w-full items-center justify-between my-1 p-1 group hover:bg-slate-100 rounded-md cursor-pointer text-slate-700 hover:text-slate-950"
                onClick={onSignOutButtonClick}
              >
                <span className="my-1 w-full rounded-md p-1 text-base text-center text-slate-700 hover:text-slate-950 hover:bg-slate-100">
                  Sign Out
                </span>
              </Button>
            </div>
          </TooltipComponent>
        </div>
      </div>
    </div>
  );
}

export default memo(Navbar);
