
import { Service } from "@/types/service.types";

export interface NotificationPayload {
  service: Service;
  status: string;
  responseTime?: number;
  timestamp: string;
  message?: string;
  _notificationSource?: string; // Internal flag to prevent duplicate notifications
}
