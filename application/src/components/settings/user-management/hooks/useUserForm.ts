
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userFormSchema, newUserFormSchema, UserFormValues, NewUserFormValues } from "../userForms";
import { avatarOptions } from "../avatarOptions";

export const useUserForm = () => {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      full_name: "",
      email: "",
      username: "",
      isActive: true,
      role: "user",
      avatar: "",
    },
  });

  const newUserForm = useForm<NewUserFormValues>({
    resolver: zodResolver(newUserFormSchema),
    defaultValues: {
      full_name: "",
      email: "",
      username: "",
      password: "",
      passwordConfirm: "",
      isActive: true,
      role: "user",
      avatar: avatarOptions[0].url,
    },
  });

  return { form, newUserForm };
};
