import { memo } from "react";
import UserCreateDialog from "./UserCreateDialog";

function PeopleIdNavbar() {
  return (
    <div className="mb-8 mt-4 flex items-center justify-end">
      <UserCreateDialog type="create" />
    </div>
  );
}

export default memo(PeopleIdNavbar);
