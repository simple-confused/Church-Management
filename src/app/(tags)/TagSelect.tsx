"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTagsContext } from "@/my_components/providers/TagsProvider";
import { memo } from "react";

function TagSelect() {
  const { setDialogType, dialogType } = useTagsContext();
  return (
    <Select
      defaultValue="tags"
      value={dialogType}
      onValueChange={(e) => setDialogType(e as "tags" | "groups")}
    >
      <SelectTrigger className="border-none min-w-[140px] flex items-center justify-between">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="tags">Create Tags</SelectItem>
        <SelectItem value="groups">Create Groups</SelectItem>
      </SelectContent>
    </Select>
  );
}
export default memo(TagSelect);
