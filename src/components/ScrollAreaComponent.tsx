"use client";
import { ReactElement } from "react";
import { ScrollArea } from "./ui/scroll-area";

function ScrollAreaComponent({ children }: { children: ReactElement }) {
  return <ScrollArea>{children}</ScrollArea>;
}

export default ScrollAreaComponent;
