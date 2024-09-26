import { z } from "zod";

export default z.object({
  emailOtp: z.string().min(6, "Verification code must be 6 digits."),
});
