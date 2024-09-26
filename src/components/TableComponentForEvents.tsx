import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { memo, useCallback } from "react";
import AlertDialogComponent from "./AlertDialogComponent";
import TooltipComponent from "./TooltipComponent";
import { Pencil, Trash } from "lucide-react";
import { usePathname } from "next/navigation";
import axios from "axios";
import EventDialog from "@/app/(events)/EventDialog";
import { useEventsContext } from "@/my_components/providers/EventsProvider";

interface EventInfoValue {
  name: string;
  description: string;
  date_day: number;
  date_month: number;
  date_year: number;
  time: string;
  Tag_Name: string;
  _id: string;
}

const heading = ["Event Name", "Date", "Time", "Tag Name", "Description"];

function TableComponentForEvents({ Events }: { Events: EventInfoValue[] }) {
  const pathname = usePathname();
  const { setEventIdForUpdate, setEventsInfo, UserInfo } = useEventsContext();

  const deleteEvent = useCallback(async (id: string) => {
    try {
      const { data } = await axios.delete(`/api/v1/events?eventId=${id}`);
      if (data.success) {
        setEventsInfo((prev) => prev.filter((e) => e._id !== id));
      } else {
        console.log(data);
      }
    } catch (err: any) {
      console.log(err.message);
    }
  }, []);

  return (
    <Table className="my-8">
      <TableCaption>Events Infomation</TableCaption>
      <TableHeader>
        <TableRow>
          {heading?.map((row) => (
            <TableHead key={row}>{row}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Events?.map(
          ({
            Tag_Name,
            date_day,
            date_month,
            date_year,
            name,
            time,
            description,
            _id,
          }) => (
            <TableRow key={_id}>
              <TableCell>{name}</TableCell>
              <TableCell>
                {new Date(
                  `${date_month + 1}-${date_day}-${date_year}`
                ).toDateString()}
              </TableCell>
              <TableCell>{time}</TableCell>
              <TableCell>{Tag_Name}</TableCell>
              <TableCell>{description}</TableCell>
              {pathname.includes("/events") && UserInfo?.role === "owner" && (
                <TableCell>
                  <AlertDialogComponent
                    description={`Do you want to delete ${name} event?`}
                    title="Delete Event"
                    _id={_id}
                    onActionClick={deleteEvent}
                    trigger={
                      <TooltipComponent
                        hoverElement={
                          <Trash className="size-4 text-red-700 hover:text-red-600 transition" />
                        }
                      >
                        <div>Delete Event</div>
                      </TooltipComponent>
                    }
                  />
                </TableCell>
              )}
              {pathname.includes("/events") && UserInfo?.role === "owner" && (
                <TableCell>
                  <EventDialog
                    type="update"
                    trigger={
                      <TooltipComponent
                        hoverElement={
                          <Pencil
                            onClick={() => {
                              setEventIdForUpdate(_id);
                            }}
                            className="size-4 text-zinc-700 hover:text-black transition"
                          />
                        }
                      >
                        <div>Update Event</div>
                      </TooltipComponent>
                    }
                  />
                </TableCell>
              )}
            </TableRow>
          )
        )}
      </TableBody>
    </Table>
  );
}

export default memo(TableComponentForEvents);
