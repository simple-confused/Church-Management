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
  const isAttendancePage = pathName.includes("/attendance");
  const isPaymentsPage = pathName.includes("/payments");
  const isMainPage = !isAttendancePage && !isPaymentsPage;

  return (
    <div className="mb-8 mt-4 flex items-center justify-between">
      {type === "create" && (
        <h1 className="text-lg">{peopleCount} people found</h1>
      )}

      {type === "edit" && isMainPage && (
        <h1 className="text-lg text-zinc-600">People Information :</h1>
      )}
      {type === "edit" && isAttendancePage && (
        <h1 className="text-lg text-zinc-600">Attendance :</h1>
      )}
      {type === "edit" && isPaymentsPage && (
        <h1 className="text-lg text-zinc-600">Payments :</h1>
      )}

      {role !== "people" && type === "edit" && isMainPage && (
        <Navigation
          pathName={pathName
            .replace("/attendance", "")
            .replace("/payments", "")}
        />
      )}

      {type === "create" && <PeopleFilterOptions />}

      {role === "owner" && isMainPage ? (
        <UserCreateDialog type={type} />
      ) : (
        <div className="min-w-[100px]"></div>
      )}
    </div>
  );
}

export default memo(PeopleNavbar);
