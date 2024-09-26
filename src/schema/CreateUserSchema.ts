import { z } from "zod";

export default z.object({
  name: z.string().min(1, "Name is required"),
  gender: z.enum(["male", "female", "others", ""]),
  date_of_birth: z
    .string()
    .min(10, "Date is invalid")
    .max(10, "Date is invalid"),
  address: z.string().min(1, "Address is required"),
  phone_number: z
    .string()
    .min(10, "Phone number should be at least 10 digits")
    .max(10, "Phone number should be less than 11"),
  email: z.string().email("Enter a valid email"),
  image: z.string(),
});
