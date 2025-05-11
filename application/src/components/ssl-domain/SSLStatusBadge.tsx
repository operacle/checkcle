
import React from "react";
import { Badge } from "@/components/ui/badge";

interface SSLStatusBadgeProps {
  status: string;
}

export const SSLStatusBadge: React.FC<SSLStatusBadgeProps> = ({ status }) => {
  let variant = "";
  let label = "";

  switch (status) {
    case "valid":
      variant = "bg-green-500 hover:bg-green-600";
      label = "Valid";
      break;
    case "expiring_soon":
      variant = "bg-yellow-500 hover:bg-yellow-600";
      label = "Expiring Soon";
      break;
    case "expired":
      variant = "bg-red-500 hover:bg-red-600";
      label = "Expired";
      break;
    default:
      variant = "bg-gray-500 hover:bg-gray-600";
      label = status.charAt(0).toUpperCase() + status.slice(1);
  }

  return (
    <Badge className={`${variant} text-white`}>
      {label}
    </Badge>
  );
};