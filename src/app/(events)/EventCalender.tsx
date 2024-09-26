import TooltipComponent from "@/components/TooltipComponent";
import { Button } from "@/components/ui/button";
import { useEventsContext } from "@/my_components/providers/EventsProvider";
import axios from "axios";
import clsx from "clsx";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isToday,
  parse,
} from "date-fns";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { memo, useCallback, useEffect, useState } from "react";

const WeekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function EventCalender() {
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(
    format(currentDate, "MMM-yyyy")
  );
  const [month, setMonth] = useState(new Date().getMonth());
  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());
  const daysInMonth = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });
  const startingDayIndex = getDay(firstDayCurrentMonth);
  const { eventsInfo: events, setEventsInfo } = useEventsContext();

  const previousMonth = useCallback(async () => {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
    setMonth((prev) => prev - 1);
    const { data } = await axios.get(`/api/v1/events?month=${month - 1}`);
    if (data.success) {
      setEventsInfo(data.data.Events);
    }
  }, [month]);

  const nextMonth = useCallback(async () => {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
    setMonth((prev) => prev + 1);
    const { data } = await axios.get(`/api/v1/events?month=${month + 1}`);
    if (data.success) {
      setEventsInfo(data.data.Events);
    }
  }, [month]);

  useEffect(() => {}, [currentMonth]);
  // console.log(currentMonth);

  return (
    <div className="mt-4 bg-white rounded-lg shadow-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <TooltipComponent
          hoverElement={
            <Button
              variant="ghost"
              onClick={previousMonth}
              className="text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 rounded-full p-2"
            >
              <ArrowLeft className="size-6" />
            </Button>
          }
        >
          <p>Previous month</p>
        </TooltipComponent>

        <h1 className="text-3xl font-bold text-zinc-800">{currentMonth}</h1>

        <TooltipComponent
          hoverElement={
            <Button
              variant="ghost"
              onClick={nextMonth}
              className="text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 rounded-full p-2"
            >
              <ArrowRight className="size-6" />
            </Button>
          }
        >
          <p>Next month</p>
        </TooltipComponent>
      </div>

      <div className="grid grid-cols-7 gap-4 mt-6">
        {WeekDays.map((day, i) => (
          <div
            key={day}
            className="text-center font-semibold text-lg text-zinc-500"
          >
            {day}
          </div>
        ))}

        {Array.from({ length: startingDayIndex }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {daysInMonth.map((day, i) => (
          <div
            key={i}
            className={clsx(
              "border border-zinc-200 rounded-lg p-4 h-24 text-center flex flex-col justify-between items-center hover:bg-blue-50 transition-all",
              {
                "bg-blue-600 text-white": isToday(day),
              }
            )}
          >
            <div className="font-bold">{format(day, "d")}</div>
            {events.length > 0 && (
              <div className="mt-2 w-full max-h-12 overflow-y-auto">
                {events.map(
                  ({ name, description, date_day, date_month, time }) =>
                    date_day === Number(format(day, "d")) &&
                    new Date(currentMonth).getMonth() === date_month && (
                      <div
                        key={description}
                        className="w-full text-xs text-blue-900 bg-blue-100 rounded-full py-1 px-2 my-1"
                      >
                        <p>{name}</p>
                        <p>{time}</p>
                      </div>
                    )
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(EventCalender);
