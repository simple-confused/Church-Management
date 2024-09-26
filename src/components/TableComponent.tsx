"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, MessageSquare, Trash } from "lucide-react";
import { memo, useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { usePeopleContext } from "@/my_components/providers/PeopleProvider";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";

const TooltipComponent = dynamic(() => import("./TooltipComponent"));
const AlertDialogComponent = dynamic(() => import("./AlertDialogComponent"));

interface TableComponentProps {
  type: "people" | "tagpeople";
  tableHeading: string[];
}

interface PeopleInfoValue {
  _id: string;
  name: string;
  email: string;
  date_of_birth: string;
  image: string;
  UnseenChatCount?: number;
}

const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;

function TableComponent({ tableHeading, type }: TableComponentProps) {
  const {
    peopleInfo: info,
    tagInfo,
    filterOptions,
    setPeopleCount,
    peopleCount,
    setIsChatSheetOpen,
    setChatInfo,
    role,
    setMessage,
    setIsChatLoading,
  } = usePeopleContext();
  const [peopleInfo, setPeopleInfo] = useState(info);
  const [page, setPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const deletePeople = useCallback(async (id: string) => {
    try {
      if (type == "people") {
        const { data } = await axios.delete(`/api/v1/people?peopleId=${id}`);
        if (data.success) {
          router.refresh();
        } else {
          console.log(data);
        }
      } else if (type === "tagpeople") {
        console.log(id, tagInfo?._id);
        const { data } = await axios.delete(
          `/api/v1/tags?peopleId=${id}&tagId=${tagInfo?._id}`
        );
        if (data.success) {
          router.refresh();
        } else {
          console.log(data);
        }
      }
    } catch (err: any) {
      console.log(err.message);
    }
  }, []);

  const onMsgButtonClick = useCallback(
    async (e: any, _id: string, name: string, image: string) => {
      try {
        setIsChatSheetOpen(true);
        e.stopPropagation();
        setChatInfo({
          _id,
          imageUrl: image,
          name,
        });
        setIsChatLoading(true);
        const { data } = await axios.get(`/api/v1/chat?peopleId=${_id}`);
        if (data.success) {
          setMessage(data?.data || []);
          setIsChatLoading(false);
        }
      } catch (err) {
        console.log(err);
      }
    },
    []
  );

  const methodForFilterRequest = useCallback(async () => {
    try {
      if (filterOptions.gender || filterOptions.order) {
        setIsLoading(true);
        const { data } = await axios.get(
          `/api/v1/people?page=${page + 1}${
            filterOptions.gender && `&gender=${filterOptions.gender}`
          }`
        );
        if (data.success) {
          setPeopleInfo(data.data.Peoples);
          setPeopleCount(data.data?.PeopleCount);
        }
      } else if (page) {
        setIsLoading(true);
        const { data } = await axios.get(
          `/api/v1/people?page=${page + 1}${
            filterOptions.gender && `&gender=${filterOptions.gender}`
          }`
        );
        if (data.success) {
          setPeopleInfo((prev: any) => [...prev, ...data.data.Peoples]);
          setPeopleCount(data.data?.PeopleCount);
        }
      }
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  }, [filterOptions, page]);

  useEffect(() => {
    methodForFilterRequest();
  }, [filterOptions, page]);

  return (
    <div className="flex items-center justify-center flex-col">
      <Table>
        <TableHeader>
          <TableRow>
            {tableHeading.map((row) => (
              <TableHead key={row}>{row}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {peopleInfo?.map(
            ({
              email,
              name,
              date_of_birth,
              _id,
              image,
              UnseenChatCount,
            }: PeopleInfoValue) => (
              <TableRow
                key={_id}
                className="cursor-pointer"
                onClick={() => router.push(`/people/${_id}`)}
              >
                <TableCell>
                  <div className="flex items-center">
                    <Avatar className="mr-4">
                      <AvatarImage src={`${image}`} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    {name}
                  </div>
                </TableCell>
                <TableCell>{email}</TableCell>
                <TableCell>
                  {new Date().getFullYear() -
                    new Date(date_of_birth).getFullYear()}
                </TableCell>
                {role === "owner" && type === "people" && (
                  <TableCell>
                    <div className="flex items-center justify-center text-zinc-500 hover:text-zinc-700 size-full">
                      <MessageSquare
                        className="size-4 mr-1"
                        onClick={(e) => onMsgButtonClick(e, _id, name, image)}
                      />
                      {Boolean(UnseenChatCount) && (
                        <h1 className="text-black">{UnseenChatCount}</h1>
                      )}
                    </div>
                  </TableCell>
                )}
                {role === "owner" && (
                  <TableCell>
                    <AlertDialogComponent
                      description={
                        type === "people"
                          ? `Data of ${name} will be permanently deleted.`
                          : `Delete the people ${name} from the tag ${tagInfo?.name}.`
                      }
                      title={
                        type === "tagpeople"
                          ? `Are you want to delete the user from the ${tagInfo?.name}`
                          : `Are you want to delete ${name} ?`
                      }
                      _id={_id}
                      onActionClick={deletePeople}
                      trigger={
                        <TooltipComponent
                          hoverElement={
                            <Trash className="size-4 text-red-700 hover:text-red-600 transition" />
                          }
                        >
                          <div>
                            {type === "people" && <h1>Delete People</h1>}
                            {type === "tagpeople" && (
                              <h1>Delete From the tag</h1>
                            )}
                          </div>
                        </TooltipComponent>
                      }
                    />
                  </TableCell>
                )}
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
      {peopleInfo?.length < Number(peopleCount) && (
        <Button
          variant="outline"
          size="sm"
          className="m-4"
          onClick={() => setPage((prev) => prev + 1)}
        >
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Load more"
          )}
        </Button>
      )}
    </div>
  );
}

export default memo(TableComponent);
