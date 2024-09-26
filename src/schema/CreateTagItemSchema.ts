import { z } from "zod";

export default z.object({
  name: z.string().min(1, "Name is required"),
  group: z.string(),
});
