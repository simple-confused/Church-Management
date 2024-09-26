import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ReactElement } from "react";
interface TooltipContentValue {
  children: ReactElement;
  hoverElement: ReactElement;
}

function TooltipComponent({ children, hoverElement }: TooltipContentValue) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{hoverElement}</TooltipTrigger>
        <TooltipContent>{children}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default TooltipComponent;
