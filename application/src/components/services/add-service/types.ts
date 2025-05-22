import { z } from "zod";


export const serviceSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  type: z.string().min(1, "Service type is required"),
  url: z.string().min(1, "Service URL is required"),
  interval: z.string().min(1, "Heartbeat interval is required"),
  retries: z.string().min(1, "Maximum retries is required"),
  notificationChannel: z.string().optional(),
  alertTemplate: z.string().optional(),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;



// import { useLanguage } from "@/contexts/LanguageContext";
// import { z } from "zod";

// export const useServiceSchema = () => {
//   const { t } = useLanguage();

//   return z.object({
//     name: z.string().min(1, { message: t("serviceNameIsRequired") }),
//     type: z.string().min(1, { message: t("serviceTypeIsRequired") }),
//     url: z.string().min(1, { message: t("serviceURLIsRequired") }),
//     interval: z.string().min(1, { message: t("heartbeatIntervalIsRequired") }),
//     retries: z.string().min(1, { message: t("maximumRetriesIsRequired") }),
//     notificationChannel: z.string().optional(),
//     alertTemplate: z.string().optional(),
//   });
// };

// export type ServiceFormData = z.infer<ReturnType<typeof useServiceSchema>>;
