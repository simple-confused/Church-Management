import TagsDialog from "@/app/(tags)/TagsDialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTagsContext } from "@/my_components/providers/TagsProvider";
import Link from "next/link";
import { memo, useCallback } from "react";
import TooltipComponent from "./TooltipComponent";
import { Pencil, Trash } from "lucide-react";
import AlertDialogComponent from "./AlertDialogComponent";
import axios from "axios";
import { useRouter } from "next/navigation";

interface AccordionComponentProps {
  itemKey: string;
  trigger: string;
  content: {
    _id: string;
    name: string;
  }[];
}

function AccordionComponent({
  content,
  itemKey,
  trigger,
}: AccordionComponentProps) {
  const { setTagIdForUpdate, setDialogType, setGroupIdForUpdate, UserInfo } =
    useTagsContext();
  const router = useRouter();
  const deletePeople = useCallback(async (id: string) => {
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
  return (
    <Accordion type="multiple" className="w-full mr-4">
      <AccordionItem value={itemKey}>
        <AccordionTrigger>{trigger}</AccordionTrigger>
        {content.map(({ _id, name }) => (
          <AccordionContent
            key={_id}
            className="flex items-center justify-between"
          >
            <div
              key={_id}
              className="group w-full flex items-center justify-between"
            >
              <Link href={`/tags/${_id}`} className="flex-1">
                {name}
              </Link>
              {UserInfo?.role === "owner" && (
                <div>
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
                              setGroupIdForUpdate(itemKey);
                            }}
                            className="size-4 mr-4 invisible group-hover:visible text-zinc-500 hover:text-zinc-700"
                          />
                        }
                      >
                        <h1>Update Tag</h1>
                      </TooltipComponent>
                    }
                  ></TagsDialog>
                  <AlertDialogComponent
                    description={`Only the tag ${name} will be deleted not the people data.`}
                    title={`Are you want to delete ${name} the tag ?`}
                    _id={_id}
                    onActionClick={deletePeople}
                    trigger={
                      <TooltipComponent
                        hoverElement={
                          <Trash className="size-4 mr-4 invisible group-hover:visible text-red-500" />
                        }
                      >
                        <h1>Delete Tag</h1>
                      </TooltipComponent>
                    }
                  />
                </div>
              )}
            </div>
          </AccordionContent>
        ))}
      </AccordionItem>
    </Accordion>
  );
}

export default memo(AccordionComponent);
