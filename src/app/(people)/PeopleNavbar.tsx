"use client";

import dynamic from "next/dynamic";
import { memo } from "react";
import { usePeopleContext } from "@/my_components/providers/PeopleProvider";
import PeopleFilterOptions from "./PeopleFilterOptions";
import Navigation from "./Navigation";
import { usePathname } from "next/navigation";

const UserCreateDialog = dynamic(() => import("./UserCreateDialog"));

function PeopleNavbar({ type }: { type: "create" | "edit" }) {
  const { peopleCount, role } = usePeopleContext();
  const pathName = usePathname();
  return (
    <div className="mb-8 mt-4 flex items-center justify-between">
      {type === "create" && (
        <h1 className="text-lg">{peopleCount} people found</h1>
      )}
      {type === "edit" &&
        !pathName.includes("/attendance") &&
        !pathName.includes("/payments") && (
          <h1 className="text-lg text-zinc-600">People Infomation : </h1>
        )}
      {type === "edit" && pathName.includes("/attendance") && (
        <h1 className="text-lg text-zinc-600">Attendance : </h1>
      )}
      {type === "edit" && pathName.includes("/payments") && (
        <h1 className="text-lg text-zinc-600">Payments : </h1>
      )}
      {role !== "people" && type === "edit" && (
        <Navigation
          pathName={pathName
            .replaceAll("/attendance", "")
            .replaceAll("/payments", "")}
        />
      )}
      {type == "create" && <PeopleFilterOptions />}
      {role === "owner" &&
      !pathName.includes("/attendance") &&
      !pathName.includes("/payments") ? (
        <UserCreateDialog type={type} />
      ) : (
        <div className="min-w-[100px]"></div>
      )}
    </div>
  );
}

export default memo(PeopleNavbar);
