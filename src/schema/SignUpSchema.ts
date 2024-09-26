import { z } from "zod";

export default z.object({
  name: z
    .string()
    .min(3, "Name must be atleast 3 characters long.")
    .max(20, "Name must be no more than 20 characters."),
  email: z.string().email("Enter valid email."),
  password: z
    .string()
    .min(6, "Password must be atleast 6 characters long.")
    .regex(
      /[^A-Za-z0-9]/,
      "Use special characters, number, upper case and lower case to make the password strong."
    ),
  image: z.string(),
});
