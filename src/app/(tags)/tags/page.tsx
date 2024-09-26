"use client";

import AccordionComponent from "@/components/AccordionComponent";
import AlertDialogComponent from "@/components/AlertDialogComponent";
import TooltipComponent from "@/components/TooltipComponent";
import { useTagsContext } from "@/my_components/providers/TagsProvider";
import axios from "axios";
import { Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { memo, useCallback } from "react";
import SubNavbarForTags from "./SubNavbarForTags";
import TagsDialog from "../TagsDialog";

function Page() {
  const {
    tagsInfo,
    groupsInfo,
    UserInfo,
    setTagIdForUpdate,
    setDialogType,
    setGroupIdForUpdate,
  } = useTagsContext();
  const router = useRouter();
  const deleteTags = useCallback(async (id: string) => {
    try {
      const { data } = await axios.delete(
        `/api/v1/tags/tag-item?tagItem=${id}`
      );
      if (data.success) {
        router.refresh();
      } else {
        console.log(data);
      }
    } catch (err: any) {
      console.log(err.message);
    }
  }, []);

  const deleteGroup = useCallback(async (id: string) => {
    try {
      const { data } = await axios.delete(
        `/api/v1/tags/tag-group?tagItem=${id}`
      );
      if (data.success) {
        router.refresh();
      } else {
        console.log(data);
      }
    } catch (err: any) {
      console.log(err.message);
    }
  }, []);

  return (
    <div>
      {UserInfo?.role !== "people" && <SubNavbarForTags />}
      <div
        className={`h-full flex justify-center gap-x-12 gap-y-6 ${
          UserInfo?.role !== "people" ? "flex-col sm:flex-row" : ""
        }`}
      >
        {UserInfo?.role !== "people" && (
          <div className="flex flex-col w-full gap-y-4">
            <h1>Group : </h1>
            {groupsInfo?.map(({ _id, name, SubItem }) => (
              <div className="flex w-full group" key={_id}>
                <AccordionComponent
                  content={SubItem}
                  itemKey={_id}
                  trigger={name}
                />
                {UserInfo?.role === "owner" && (
                  <div className="flex items-center justify-between">
                    <TagsDialog
                      title="Update group"
                      type="update"
                      descriptions={`Update the group ${name}`}
                      trigger={
                        <TooltipComponent
                          hoverElement={
                            <Pencil
                              onClick={() => {
                                setGroupIdForUpdate(_id);
                                setDialogType("groups");
                              }}
                              className="size-4 mr-4 text-zinc-500 hover:text-zinc-700 transition invisible group-hover:visible"
                            />
                          }
                        >
                          <h1>Update Group</h1>
                        </TooltipComponent>
                      }
                    ></TagsDialog>
                    <AlertDialogComponent
                      description={`Only the tag ${name} will be deleted not the people data.`}
                      title={`Are you want to delete ${name} the tag ?`}
                      _id={_id}
                      onActionClick={deleteGroup}
                      trigger={
                        <TooltipComponent
                          hoverElement={
                            <Trash className="size-4 mr-4 text-red-700 hover:text-red-600 transition invisible group-hover:visible" />
                          }
                        >
                          <h1>Delete Group</h1>
                        </TooltipComponent>
                      }
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <div className="flex flex-col w-full gap-y-4">
          {tagsInfo.map(({ _id, name }) => (
            <div
              key={_id}
              className="flex items-center justify-between border-b py-4 text-zinc-500 hover:text-zinc-700 hover:cursor-pointer hover:underline group"
            >
              <Link href={`/tags/${_id}`} className="flex-grow">
                {name}
              </Link>
              {UserInfo?.role === "owner" && (
                <TagsDialog
                  type="update"
                  descriptions={`Update the tag ${name}`}
                  trigger={
                    <TooltipComponent
                      hoverElement={
                        <Pencil
                          onClick={() => {
                            setTagIdForUpdate(_id);
                            setDialogType("tags");
                            setGroupIdForUpdate("");
                          }}
                          className="size-4 mr-4 text-zinc-500 hover:text-zinc-700 transition invisible group-hover:visible"
                        />
                      }
                    >
                      <h1>Update Tag</h1>
                    </TooltipComponent>
                  }
                ></TagsDialog>
              )}
              {UserInfo?.role === "owner" && (
                <AlertDialogComponent
                  description={`Only the tag ${name} will be deleted not the people data.`}
                  title={`Are you want to delete ${name} the tag ?`}
                  _id={_id}
                  onActionClick={deleteTags}
                  trigger={
                    <TooltipComponent
                      hoverElement={
                        <Trash className="size-4 mr-4 text-red-700 hover:text-red-600 transition invisible group-hover:visible" />
                      }
                    >
                      <h1>Delete Tag</h1>
                    </TooltipComponent>
                  }
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(Page);
