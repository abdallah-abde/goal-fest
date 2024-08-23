import { z } from "zod";

const _fileSchema = z.instanceof(File, { message: "Required" });

export const ImageSchema = _fileSchema.refine(
  (file) => file.size === 0 || file.type.startsWith("image/")
);

export const LoginSchema = z.object({
  email: z.string().email({ message: "Email is required!" }),
  password: z.string().min(1, { message: "Password is required!" }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  name: z.string().min(1, { message: "Name is required!" }),
  email: z.string().email({ message: "Email is required!" }),
  password: z.string().min(6, { message: "Minimum password is 6 chars!" }),
});

export const ResetSchema = z.object({
  email: z.string().email({ message: "Email is required!" }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, { message: "Minimum password is 6 chars!" }),
});
