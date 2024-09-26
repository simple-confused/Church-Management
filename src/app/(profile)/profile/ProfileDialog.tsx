"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Toaster } from "@/components/ui/toaster";
import { useProfileContext } from "@/my_components/providers/ProfileProvider";
import dynamic from "next/dynamic";
import { ReactNode, memo, useEffect, useState } from "react";

const ProfileFormChurch = dynamic(() => import("./ProfileFormChurch"));

interface EventsDialogProps {
  trigger: ReactNode;
  role: string;
}

function EventDialog({ trigger, role }: EventsDialogProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { UserInfo } = useProfileContext();
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
        </DialogHeader>
        <DialogDescription>Update Profile</DialogDescription>
        {role === "owner" && (
          <ProfileFormChurch
            name={UserInfo?.name || ""}
            razorpay_api_key={UserInfo?.razorpay_api_key}
            razorpay_secret_key={UserInfo?.razorpay_secret_key}
          />
        )}
      </DialogContent>
      {/* {isFormError && (
        <DialogFooter>
          <Toaster />
        </DialogFooter>
      )} */}
    </Dialog>
  );
}

export default memo(EventDialog);
