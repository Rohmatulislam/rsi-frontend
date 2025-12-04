import { z } from "zod";

export const loginformSchema = z.object({
  email: z.string().email({ message: "Alamat email tidak valid" }),
  password: z
    .string()
    .min(8, { message: "Kata sandi harus minimal 8 karakter" }),
});

export type LoginFormSchema = z.infer<typeof loginformSchema>;
