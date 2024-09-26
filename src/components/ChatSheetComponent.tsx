"use client";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { usePeopleContext } from "@/my_components/providers/PeopleProvider";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useDashboardContext } from "@/my_components/providers/DashboardProvider";
import { pusherClient } from "@/lib/Pusher";

const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;

function ChatSheetComponent({ role }: { role: string }) {
  const {
    isChatSheetOpen,
    setIsChatSheetOpen,
    chatInfo,
    setChatInfo,
    message: peopleMessage,
    setMessage: setPeopleMessage,
    isChatLoading: isPeopleChatLoading,
    setIsChatLoading: setIsPeopleChatLoading,
  } = usePeopleContext();
  const {
    isChatSheetOpen: dashboardOpen,
    setIsChatSheetOpen: setDashboardOpen,
    chatInfo: dashboardChatInfo,
    setChatInfo: setDashboardChatInfo,
    UserInfo,
    message: dashboardMessage,
    setMessage: setDashboardMessage,
    isChatLoading: isDashboardChatLoading,
    setIsChatLoading: setIsDashboardChatLoading,
  } = useDashboardContext();
  const [message, setMessage] = useState("");
  const lastMessage: any = useRef(null);

  const setSendMessageFunction = useCallback(
    (message: string) => {
      if (peopleMessage?.length || dashboardMessage?.length) {
        if (role === "people") {
          setDashboardMessage((prev: any) => [
            ...prev,
            {
              _id: Math.floor(Math.random() * 9999).toString(),
              createdAt: new Date(),
              message,
              sender: UserInfo?._id,
            },
          ]);
        } else {
          setPeopleMessage((prev: any) => [
            ...prev,
            {
              _id: Math.floor(Math.random() * 9999).toString(),
              createdAt: new Date(),
              message,
              sender: Math.floor(Math.random() * 9999).toString(),
            },
          ]);
        }
      } else {
        if (role === "people") {
          setDashboardMessage([
            {
              _id: Math.floor(Math.random() * 9999).toString(),
              createdAt: new Date().toString(),
              message,
              sender: UserInfo?._id || "",
            },
          ]);
        } else {
          setPeopleMessage([
            {
              _id: Math.floor(Math.random() * 9999).toString(),
              createdAt: new Date().toString(),
              message,
              sender: Math.floor(Math.random() * 9999).toString(),
            },
          ]);
        }
      }
    },
    [peopleMessage, dashboardMessage]
  );

  const setReceiveMessageFunction = (message: string) => {
    if (role === "owner") {
      setPeopleMessage((prev: any) => [
        ...prev,
        {
          _id: Math.floor(Math.random() * 9999).toString(),
          createdAt: new Date(),
          message,
          sender: chatInfo?._id || "",
        },
      ]);
    } else if (role === "people") {
      setDashboardMessage((prev: any) => [
        ...prev,
        {
          _id: Math.floor(Math.random() * 9999).toString(),
          createdAt: new Date(),
          message,
          sender: chatInfo?._id || "",
        },
      ]);
    }
  };

  const submitMessage = useCallback(async () => {
    try {
      if (message) {
        const { data } = await axios.post("/api/v1/chat", {
          message,
          peopleId: chatInfo?._id,
        });
        if (data.success) {
          setSendMessageFunction(message);
          setMessage("");
        }
      }
    } catch (err: any) {
      console.log(err);
    }
  }, [message, chatInfo]);

  useEffect(() => {
    lastMessage?.current?.scrollIntoView([{ behavior: "smooth" }]);
  }, [peopleMessage, dashboardMessage]);

  useEffect(() => {
    console.log("how many times use effect running");
    if (role === "people" && dashboardChatInfo?._id) {
      pusherClient.subscribe(`from${UserInfo?._id}`);
      pusherClient.bind(`messages`, (message: string) => {
        setReceiveMessageFunction(message);
        console.log(UserInfo, chatInfo);
      });
    }
    return () => {
      if (role === "people" && UserInfo?._id) {
        pusherClient.unsubscribe(`from${UserInfo?._id}`);
      }
    };
  }, [dashboardChatInfo]);

  useEffect(() => {
    console.log("how many times use effect running");
    if (role === "owner" && chatInfo?._id) {
      pusherClient.subscribe(`to${chatInfo?._id}`);
      pusherClient.bind(`messages`, (message: string) => {
        setReceiveMessageFunction(message);
        console.log(UserInfo, chatInfo);
      });
    }
    return () => {
      if (role === "owner" && chatInfo?._id) {
        pusherClient.unsubscribe(`to${chatInfo?._id}`);
      }
    };
  }, [chatInfo]);

  return (
    <Sheet
      open={role === "people" ? dashboardOpen : isChatSheetOpen}
      onOpenChange={role === "people" ? setDashboardOpen : setIsChatSheetOpen}
    >
      <SheetContent className="sm:max-w-[500px] w-full py-6">
        <div className="flex items-center">
          <Avatar className="mr-4">
            <AvatarImage
              src={`${imageUrl}/w_250/q_25/f_auto/${chatInfo?.imageUrl}`}
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          {chatInfo?.name}
        </div>
        <div className="size-full flex flex-col items-center justify-between pb-16 my-4">
          {isPeopleChatLoading ? (
            <div className="size-full">
              <Loader2 className="size-8 animate-spin text-zinc-300" />
            </div>
          ) : (
            <div className="size-full border rounded-lg my-1 max-h-[80dvh] overflow-y-auto">
              {role === "people"
                ? dashboardMessage?.map(
                    ({ message, _id, createdAt, sender }) => (
                      <div
                        key={_id}
                        className={`w-full flex items-center justify-between  ${
                          UserInfo?._id === sender && "flex-row-reverse"
                        }`}
                      >
                        <div className="bg-slate-500 rounded-md p-2 m-1 w-1/2">
                          <p className="text-zinc-100">{message}</p>
                          <h1 className="text-end mt-2 text-white">
                            {`${
                              new Date(createdAt).getHours() < 10
                                ? `0${new Date(createdAt).getHours()}`
                                : new Date(createdAt).getHours()
                            }:${
                              new Date(createdAt).getMinutes() < 10
                                ? `0${new Date(createdAt).getMinutes()}`
                                : new Date(createdAt).getMinutes()
                            }`}
                          </h1>
                        </div>
                        <div className="w-1/2"></div>
                      </div>
                    )
                  )
                : peopleMessage?.map(({ message, _id, createdAt, sender }) => (
                    <div
                      key={_id}
                      className={`w-full flex items-center justify-between  ${
                        chatInfo?._id === sender ? "" : "flex-row-reverse"
                      }`}
                    >
                      <div className="bg-slate-500 rounded-md p-2 m-1 w-1/2">
                        <p className="text-zinc-100">{message}</p>
                        <h1 className="text-end mt-2 text-white">
                          {`${
                            new Date(createdAt).getHours() < 10
                              ? `0${new Date(createdAt).getHours()}`
                              : new Date(createdAt).getHours()
                          }:${
                            new Date(createdAt).getMinutes() < 10
                              ? `0${new Date(createdAt).getMinutes()}`
                              : new Date(createdAt).getMinutes()
                          }`}
                        </h1>
                      </div>
                      <div className="w-1/2"></div>
                    </div>
                  ))}
              <div ref={lastMessage}></div>
            </div>
          )}
          <div className="relative w-full mt-1">
            <Textarea
              className="w-full"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button
              size="sm"
              disabled={isPeopleChatLoading || isDashboardChatLoading}
              onClick={submitMessage}
              className="absolute right-2 bottom-2"
            >
              Send
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default memo(ChatSheetComponent);
