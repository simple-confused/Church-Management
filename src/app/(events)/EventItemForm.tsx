import dynamic from "next/dynamic";
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import CreateEventSchema from "@/schema/CreateEventSchema";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEventsContext } from "@/my_components/providers/EventsProvider";

const CustomFormInput = dynamic(
  () => import("@/my_components/Form/CustomFormInput")
);
const CustomComboBox = dynamic(() => import("@/components/CustomComboBox"));
const CustomSelectInput = dynamic(
  () => import("@/my_components/Form/CustomSelectInput")
);
const CustomTextArea = dynamic(
  () => import("@/my_components/Form/CustomTextArea")
);
const CustomDateInput = dynamic(
  () => import("@/my_components/Form/CustomDateInput")
);

interface TagsOptionValue {
  _id: string;
  name: string;
}

let hourArr = [] as { value: string; label: string }[];
for (let i = 0; i < 12; i++) {
  let newValue;
  if (i < 10) {
    newValue = String(`0${i}`);
  } else {
    newValue = String(i);
  }
  hourArr.push({
    value: newValue,
    label: newValue,
  });
}
let minArr = [] as { value: string; label: string }[];
for (let i = 0; i < 60; i += 10) {
  let newValue;
  if (i < 10) {
    newValue = String(`0${i}`);
  } else {
    newValue = String(i);
  }
  minArr.push({
    value: newValue,
    label: newValue,
  });
}

function EventItemForm() {
  const [tagsOption, setTagsIOption] = useState<TagsOptionValue[]>([]);
  const { eventsInfo, eventIdForUpdate } = useEventsContext();
  const router = useRouter();
  const event = useMemo(
    () => eventsInfo?.find((e) => e._id === eventIdForUpdate),
    [eventIdForUpdate]
  );

  let form = useForm<z.infer<typeof CreateEventSchema>>({
    resolver: zodResolver(CreateEventSchema),
    defaultValues: {
      name: event?.name || "",
      tags: event?.Tag_Id || "",
      event_date: event?._id
        ? new Date(
            `${event?.date_month + 1}-${event?.date_day}-${event?.date_year}`
          )
        : new Date(),
      event_hour: event?.time.split(":")[0] || "00",
      event_minutes: event?.time.split(" ")[0].split(":")[1] || "00",
      event_time: (event?.time.split(" ")[1] as "am" | "pm") || "am",
      event_description: event?.description || "",
    },
  });

  const onSubmit = useCallback(
    async (values: z.infer<typeof CreateEventSchema>) => {
      try {
        if (event?._id) {
          const { data } = await axios.patch(
            `/api/v1/events?eventId=${event?._id}`,
            {
              name: values.name,
              tag: values.tags,
              date_day: values.event_date.getDate(),
              date_month: values.event_date.getMonth(),
              date_year: values.event_date.getFullYear(),
              time: `${values.event_hour}:${values.event_minutes} ${values.event_time}`,
              description: values.event_description,
            }
          );
          if (data.success) {
            router.refresh();
          } else {
            toast({
              title: "Error",
              description: data.message,
            });
          }
        } else {
          const { data } = await axios.post(`/api/v1/events`, {
            name: values.name,
            tag: values.tags,
            date_day: values.event_date.getDate(),
            date_month: values.event_date.getMonth(),
            date_year: values.event_date.getFullYear(),
            time: `${values.event_hour}:${values.event_minutes} ${values.event_time}`,
            description: values.event_description,
          });
          if (data.success) {
            router.refresh();
          } else {
            toast({
              title: "Error",
              description: data.message,
            });
          }
        }
      } catch (err: any) {
        toast({
          title: "Error",
          description: err?.response?.data?.message,
        });
      }
    },
    [eventIdForUpdate]
  );

  const methodForUseEffect = useCallback(() => {
    const error = form.formState.errors;

    if (error) {
      if (error.name?.message) {
        toast({
          title: "Error in email field",
          description: error.name?.message,
        });
      }
    }
  }, [form.formState.errors]);

  useEffect(methodForUseEffect, [form.formState.errors]);
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`/api/v1/events/tags`);
        console.log(data);
        if (data.success) {
          setTagsIOption(data.data.Tags_Item);
        }
      } catch (err: any) {
        toast({
          title: "Error",
          description: err?.response?.data?.message,
        });
      }
    })();
  }, []);
  return (
    <Form {...form}>
      <ScrollArea>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-h-[500px] px-4"
        >
          <CustomFormInput
            control={form.control}
            inputName="name"
            label="Event Name"
            type="text"
            placeholder="Enter a event name"
            disabled={form.formState.isSubmitting}
          />
          <div className="my-4"></div>

          <CustomComboBox
            control={form.control}
            placeholder="Attach a tag"
            placeholderForEmptyValue="Tag not found"
            inputName="tags"
            label="Tag"
            disabled={form.formState.isSubmitting}
            options={tagsOption}
          />

          <div className="my-4"></div>
          <CustomDateInput
            control={form.control}
            inputName="event_date"
            label="Event Date"
          />

          <div className="my-4"></div>
          <div className="my-4 flex items-center justify-between w-full">
            <CustomSelectInput
              control={form.control}
              inputName="event_hour"
              label="Hour"
              disabled={form.formState.isSubmitting}
              items={hourArr}
              triggerClass="w-[90px]"
            />
            <CustomSelectInput
              control={form.control}
              inputName="event_minutes"
              label="Minutes"
              disabled={form.formState.isSubmitting}
              items={minArr}
              triggerClass="w-[90px]"
            />
            <CustomSelectInput
              control={form.control}
              inputName="event_time"
              label="Time"
              disabled={form.formState.isSubmitting}
              triggerClass="w-[90px]"
              items={[
                {
                  value: "am",
                  label: "am",
                },
                {
                  value: "pm",
                  label: "pm",
                },
              ]}
            />
          </div>

          <div className="my-4"></div>
          <CustomTextArea
            control={form.control}
            inputName="event_description"
            label="Event description"
            placeholder="Short description for the event"
            disabled={form.formState.isSubmitting}
          />

          <Button variant="secondary" size="lg" className="text-lg mt-8">
            {form.formState.isSubmitting ? (
              <Loader2 className="size-6 animate-spin" />
            ) : event?._id ? (
              "Update"
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </ScrollArea>
    </Form>
  );
}

export default memo(EventItemForm);
