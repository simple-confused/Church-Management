import { z } from "zod";

export default z.object({
  name: z.string().min(1, "Name is required"),
  tags: z.string().min(1, "Tags is required"),
  event_date: z.date(),
  event_hour: z.string().min(1, "Hour is required"),
  event_minutes: z.string().min(1, "Minutes is required"),
  event_time: z.enum(["am", "pm"]),
  event_description: z
    .string()
    .min(1, "Description is required")
    .max(20, "Description is too big"),
});
