import dynamic from "next/dynamic";
import { Pencil, Plus } from "lucide-react";
import { memo } from "react";

const DialogComponent = dynamic(() => import("@/components/DialogComponent"));
const UserCreateForm = dynamic(() => import("./UserCreateForm"));

function UserCreateDialog({ type }: { type: "create" | "edit" }) {
  return (
    <DialogComponent
      dialogTrigger={
        <div className="text-lg flex items-center justify-between max-w-[200px] font-semibold border text-zinc-700 hover:bg-slate-100 hover:text-black rounded-md px-4 py-2 transition">
          {type === "create" && (
            <div className="flex items-center justify-between">
              <Plus className="size-6 mr-2" />
              Add Person
            </div>
          )}
          {type === "edit" && (
            <div className="flex items-center justify-between">
              <Pencil className="size-6 mr-2" />
              Edit Person
            </div>
          )}
        </div>
      }
      dialogTitle={type === "create" ? "Create a new user" : "Update the user"}
      dialogDescription={
        type === "create"
          ? "Create a new user who has visited the church"
          : "Update the user who has visited the church"
      }
      dialogContent={<UserCreateForm type={type} />}
    />
  );
}

export default memo(UserCreateDialog);
