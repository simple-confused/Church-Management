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
import { useEventsContext } from "@/my_components/providers/EventsProvider";
import { useTagsContext } from "@/my_components/providers/TagsProvider";
import dynamic from "next/dynamic";
import { ReactNode, memo, useEffect, useState } from "react";

const EventItemForm = dynamic(() => import("./EventItemForm"));

interface EventsDialogProps {
  trigger: ReactNode;
  type: "create" | "update";
}

function EventDialog({ trigger, type }: EventsDialogProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { isFormError } = useTagsContext();
  const { setEventIdForUpdate } = useEventsContext();
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <Dialog onOpenChange={() => type === "create" && setEventIdForUpdate("")}>
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new event</DialogTitle>
        </DialogHeader>
        <DialogDescription>Attach event for a tag.</DialogDescription>
        <EventItemForm />
      </DialogContent>
      {isFormError && (
        <DialogFooter>
          <Toaster />
        </DialogFooter>
      )}
    </Dialog>
  );
}

export default memo(EventDialog);
