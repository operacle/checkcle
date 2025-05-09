
import { UptimeData } from "@/types/service.types";

export type StatusFilter = "all" | "up" | "down" | "paused" | "warning";
export type PageSize = "10" | "25" | "50" | "100" | "250" | "all";

export interface LatestChecksTableProps {
  uptimeData: UptimeData[];
}

export interface StatusInfo {
  icon: JSX.Element;
  text: string;
  textColor: string;
  badge: JSX.Element;
}
