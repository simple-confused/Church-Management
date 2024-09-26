import { z } from "zod";

export default z.object({
  email: z.string().email("Enter valid email."),
  password: z
    .string()
    .min(6, "Credentials are incorrect")
    .regex(/[^A-Za-z0-9]/, "Credentials are incorrect"),
  emailOtp: z.string(),
});
