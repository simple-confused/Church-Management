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
import { ReactNode, memo, useEffect, useState } from "react";
import { Toaster } from "./ui/toaster";
import { usePeopleContext } from "@/my_components/providers/PeopleProvider";

interface DialogComponentProps {
  dialogTrigger: ReactNode;
  dialogTitle: string;
  dialogDescription: string;
  dialogContent?: ReactNode;
}

function DialogComponent({
  dialogTrigger,
  dialogTitle,
  dialogDescription,
  dialogContent,
}: DialogComponentProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { isFormError, setIsFormError } = usePeopleContext();
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <Dialog onOpenChange={() => setIsFormError(false)}>
      <DialogTrigger asChild>{dialogTrigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        {dialogContent}
      </DialogContent>
      {isFormError && (
        <DialogFooter>
          <Toaster />
        </DialogFooter>
      )}
    </Dialog>
  );
}

export default memo(DialogComponent);
