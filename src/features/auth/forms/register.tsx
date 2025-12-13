import { z } from "zod";

export const registerFormSchema = z
  .object({
    name: z.string().min(2, { message: "Nama harus minimal 2 karakter" }),
    email: z.string().email({ message: "Alamat email tidak valid" }),
    password: z
      .string()
      .min(6, { message: "Kata sandi harus minimal 6 karakter" }),
    confirmPassword: z.string().min(1, { message: "Konfirmasi kata sandi diperlukan" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Kata sandi tidak cocok",
    path: ["confirmPassword"],
  });

export type RegisterFormSchema = z.infer<typeof registerFormSchema>;