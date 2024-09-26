import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import NavigationMenuComponent from "@/my_components/Navbar/NavigationMenuComponent";
import ScrollAreaComponent from "./ScrollAreaComponent";
import { memo } from "react";

interface UserInfoValue {
  userInfo: { name: string; imageUrl: string; role: string };
  Pages: {
    title: string;
    path: string;
  }[];
}

const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;

function SheetComponent({ userInfo, Pages }: UserInfoValue) {
  return (
    <Sheet>
      <SheetTrigger>
        <Menu className="size-8 text-zinc-100 hover:text-white" />
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <div className="w-full my-4 flex items-center px-4">
            <img
              src={`${userInfo.imageUrl}`}
              alt="image"
              className="size-12 rounded-full mr-4"
            />
            <div className="flex flex-col justify-center">
              <h1 className="mt-1 sm:text-lg">{userInfo.name}</h1>
              <p className="text-slate-300 text-sm">{userInfo.role}</p>
            </div>
          </div>
        </SheetHeader>
        <ScrollAreaComponent>
          <NavigationMenuComponent props={Pages} />
        </ScrollAreaComponent>
      </SheetContent>
    </Sheet>
  );
}

export default memo(SheetComponent);
