
import * as z from "zod";

// Define the available roles
export const userRoles = [
  { label: "Admin", value: "admin" },
  { label: "Super Admin", value: "superadmin" }
];

export const userFormSchema = z.object({
  full_name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  isActive: z.boolean().optional(),
  role: z.string().min(1, {
    message: "Please select a role",
  }),
  avatar: z.string().optional(),
});

export const newUserFormSchema = userFormSchema.extend({
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  passwordConfirm: z.string().min(8, {
    message: "Password confirmation must be at least 8 characters.",
  }),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Passwords don't match",
  path: ["passwordConfirm"],
});

export type UserFormValues = z.infer<typeof userFormSchema>;
export type NewUserFormValues = z.infer<typeof newUserFormSchema>;