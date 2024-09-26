"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { memo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import axios from "axios";

interface Props {
  ChurchInfo: {
    _id: string;
    name: string;
    image: string;
  }[];
}
const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;

function RightSideNavbar({ ChurchInfo }: Props) {
  const onClick = async (_id: string) => {
    try {
      const { data } = await axios.post(`/api/v1/dashboard`, {
        _id,
      });
      if (data.success) {
        window.location.reload();
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="bg-slate-900 pb-4 px-4 pt-20 fixed right-0 top-0 bottom-0 flex flex-col items-center">
      <Separator className="text-zinc-400" />
      <ScrollArea className="w-full my-4">
        <div className="flex flex-col items-center gap-y-4">
          {ChurchInfo?.map(({ _id, image, name }) => (
            <TooltipProvider key={_id}>
              <Tooltip>
                <TooltipTrigger>
                  <Avatar onClick={() => onClick(_id)} className="size-12">
                    <AvatarImage src={`${imageUrl}/${image}`} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>{name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

export default memo(RightSideNavbar);
