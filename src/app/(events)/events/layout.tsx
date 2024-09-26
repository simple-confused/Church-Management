import Navbar from "@/my_components/Navbar/Navbar";
import { ReactNode } from "react";
import { Plus } from "lucide-react";
import EventDialog from "../EventDialog";
import { Button } from "@/components/ui/button";
import EventsProvider from "@/my_components/providers/EventsProvider";
import { cookies, headers } from "next/headers";
import axios from "axios";

export const metadata = {
  title: "XYZ | Events",
  description: "Events",
};

async function layout({ children }: { children: ReactNode }) {
  let eventsInfo;
  try {
    const host = headers().get("host");
    const cookieStore = cookies();
    const access_token = cookieStore.get("access_token");
    const { data } = await axios.get(
      `http://${host}/api/v1/events?month=${new Date().getMonth()}`,
      {
        headers: {
          Cookie: `${access_token?.name}=${access_token?.value}`,
        },
      }
    );
    if (data.success) {
      eventsInfo = data.data;
    }
  } catch (err: any) {
    console.log(err);
  }

  if (!eventsInfo) {
    return null;
  }
  return (
    <EventsProvider
      events={eventsInfo.Events}
      UserInfo={{
        name: eventsInfo.name,
        imageUrl: eventsInfo.image,
        role: eventsInfo.role,
      }}
    >
      <Navbar
        userInfo={{
          name: eventsInfo.name,
          imageUrl: eventsInfo.image,
          role: eventsInfo.role,
        }}
      />
      <div className="px-2 pt-24 md:px-4 max-w-7xl mx-auto flex flex-col min-h-dvh">
        <div className="flex items-center justify-end">
          {eventsInfo.role === "owner" && (
            <EventDialog
              type="create"
              trigger={
                <Button
                  variant="outline"
                  size="lg"
                  className="flex items-center justify-between text-xl text-zinc-500 hover:text-zinc-700 hover:bg-slate-100"
                >
                  <Plus className="size-6 mr-2" />
                  Add Event
                </Button>
              }
            />
          )}
        </div>
        {children}
      </div>
    </EventsProvider>
  );
}

export default layout;
