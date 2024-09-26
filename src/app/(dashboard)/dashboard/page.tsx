"use client";

import TableComponentForEvents from "@/components/TableComponentForEvents";
import { Button } from "@/components/ui/button";
import { useDashboardContext } from "@/my_components/providers/DashboardProvider";
import axios from "axios";
import { MessageSquare } from "lucide-react";
import { memo, useCallback } from "react";

function DashboardPage() {
  const {
    recentJoined,
    Events,
    UserInfo,
    PaymentAmount,
    setIsChatSheetOpen,
    setChatInfo,
    setMessage,
    setIsChatLoading,
    UnseenChatCount,
  } = useDashboardContext();
  const onMsgButtonClick = useCallback(async () => {
    try {
      setIsChatSheetOpen(true);
      setChatInfo({
        _id: UserInfo?._id,
        imageUrl: UserInfo?.imageUrl,
        name: UserInfo?.name,
      });
      setIsChatLoading(true);
      const { data } = await axios.get(`/api/v1/chat`);
      if (data.success) {
        setMessage(data?.data || []);
        setIsChatLoading(false);
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  const onButtonClick = useCallback(async () => {
    try {
      const { data } = await axios.delete(`/api/v1/dashboard`);
      if (data.success) {
        window.location.reload();
      } else {
        console.log(data);
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <div className="pt-24">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        {UserInfo?.role === "people" && (
          <div
            className="cursor-pointer text-zinc-700 hover:text-black flex items-center"
            onClick={onMsgButtonClick}
          >
            <MessageSquare className="size-4 mr-2" />
            <span className="font-semibold">{UnseenChatCount ?? 0}</span>
          </div>
        )}
        {UserInfo?.role === "admin" && (
          <Button variant="outline" size="sm" onClick={onButtonClick}>
            Change Church
          </Button>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-col gap-8">
        {UserInfo?.role !== "people" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Recent People Section */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-lg relative overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <h1 className="bg-gray-800 text-white text-center py-3 rounded-t-lg text-xl font-semibold tracking-wide">
                People Added in the Last 7 Days
              </h1>
              <div className="flex items-center justify-center py-6 text-3xl font-bold text-gray-700">
                {recentJoined}
              </div>

              {/* Shiny hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-20 transform rotate-45 translate-x-full group-hover:translate-x-0 transition-all duration-700 ease-in-out"></div>
              </div>
            </div>

            {/* Donation Section */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-lg relative overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <h1 className="bg-gray-800 text-white text-center py-3 rounded-t-lg text-xl font-semibold tracking-wide">
                People Donated in the Last 7 Days
              </h1>
              <div className="flex items-center justify-center py-6 text-3xl font-bold text-gray-700">
                {PaymentAmount || 0}
              </div>

              {/* Shiny hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-20 transform rotate-45 translate-x-full group-hover:translate-x-0 transition-all duration-700 ease-in-out"></div>
              </div>
            </div>
          </div>
        )}

        {/* Upcoming Events Section */}
        <div className="bg-white w-full rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 ease-in-out">
          <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            Upcoming Events
          </h1>
          <div className="overflow-x-auto">
            <TableComponentForEvents Events={Events} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(DashboardPage);
