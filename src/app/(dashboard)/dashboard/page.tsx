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
            className="cursor-pointer text-purple-600 hover:text-purple-800 flex items-center"
            onClick={onMsgButtonClick}
          >
            <MessageSquare className="size-4 mr-2 text-purple-500" />
            <span className="font-semibold text-purple-600">
              {UnseenChatCount ?? 0}
            </span>
          </div>
        )}
        {UserInfo?.role === "admin" && (
          <Button
            variant="outline"
            size="sm"
            onClick={onButtonClick}
            className="text-pink-600 border-pink-600 hover:bg-pink-100"
          >
            Change Church
          </Button>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-col gap-8">
        {UserInfo?.role !== "people" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Recent People Section */}
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white border border-transparent rounded-lg shadow-lg relative overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <h1 className="bg-purple-700 text-white text-center py-3 rounded-t-lg text-xl font-semibold tracking-wide">
                People Added in the Last 7 Days
              </h1>
              <div className="flex items-center justify-center py-6 text-3xl font-bold">
                {recentJoined}
              </div>
            </div>

            {/* Donation Section */}
            <div className="bg-gradient-to-r from-green-400 to-blue-400 text-white border border-transparent rounded-lg shadow-lg relative overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <h1 className="bg-green-600 text-white text-center py-3 rounded-t-lg text-xl font-semibold tracking-wide">
                People Donated in the Last 7 Days
              </h1>
              <div className="flex items-center justify-center py-6 text-3xl font-bold">
                {PaymentAmount || 0}
              </div>
            </div>
          </div>
        )}

        {/* Upcoming Events Section */}
        <div className="bg-gradient-to-r from-yellow-300 to-red-400 w-full rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 ease-in-out">
          <h1 className="text-2xl font-semibold text-center text-gray-900 mb-6">
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
