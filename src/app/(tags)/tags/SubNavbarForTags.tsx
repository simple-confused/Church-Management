"use client";
import { useTagsContext } from "@/my_components/providers/TagsProvider";
import TagsDialog from "../TagsDialog";
import { Plus } from "lucide-react";
import TagSelect from "../TagSelect";
import { Button } from "@/components/ui/button";
import { memo } from "react";
import SubNavbarForTags from "@/my_components/Navbar/SubNavbarForTags";

function SubNavbarTags() {
  const { groupsInfo, tagsInfo, UserInfo } = useTagsContext();
  return (
    <div className="mb-8 mt-4 flex items-center justify-between">
      <h1>Tags Infomation</h1>
      <SubNavbarForTags
        menu={[
          {
            type: "auto",
            trigger: "Auto Tags",
            items: [
              { name: "Male", _id: "male" },
              { name: "Female", _id: "female" },
              { name: "Others", _id: "others" },
            ],
          },
          {
            type: "tag",
            trigger: "Custome Tags",
            items: tagsInfo,
          },
          {
            type: "group",
            trigger: "Custome Groups",
            SubItems: groupsInfo,
          },
        ]}
      />
      {UserInfo?.role === "owner" ? (
        <div className="flex border rounded-md">
          <TagsDialog
            type="create"
            descriptions="You can create tags to attach multiple and optionally you can add the tags to any group."
            trigger={
              <Button
                variant="link"
                size="sm"
                className="hover:bg-gray-900 group"
              >
                <Plus className="size-6 text-zinc-300 group-hover:text-zinc-100" />
              </Button>
            }
          />
          <TagSelect />
        </div>
      ) : (
        <div className="md:w-[100px]"></div>
      )}
    </div>
  );
}

export default memo(SubNavbarTags);
