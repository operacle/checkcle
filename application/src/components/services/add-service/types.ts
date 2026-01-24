import { z } from "zod";
import type { ZodSchema } from "zod";
import { useLanguage } from "@/contexts/LanguageContext";


export type ServiceFormData = {
  name: string;
  type: "http" | "ping" | "tcp" | "dns";
  url: string;
  port?: string;
  interval: string;
  retries: string;
  notificationStatus?: "enabled" | "disabled";
  notificationChannels?: string[];
  alertTemplate?: string;
  regionalMonitoringEnabled?: boolean;
  regionalAgents?: string[];
};

// Hook to use the schema with translations
export const useServiceSchema = () => {
  const { t } = useLanguage();
  return z.object({
      name: z.string().min(1, t("serviceNameRequired")),
      type: z.enum(["http", "ping", "tcp", "dns"]),
      url: z.string()
        .min(1, t("urlDomainHostRequired"))
        .refine(
          (value) => !/\s/.test(value),
          t("spacesNotAllowed")
        )
        .refine(
          (value) => value.trim().length > 0,
          t("enterValidUrlHostnameDomain")
        ),
      port: z.string().optional(),
      interval: z.string(),
      retries: z.string(),
      notificationStatus: z.enum(["enabled", "disabled"]).optional(),
      notificationChannels: z.array(z.string()).optional(),
      alertTemplate: z.string().optional(),
      // Regional monitoring fields - now supports multiple agents
      regionalMonitoringEnabled: z.boolean().optional(),
      regionalAgents: z.array(z.string()).optional(),
    });
};