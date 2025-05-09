
import React from "react";
import { BellOff } from "lucide-react";
import { Service } from "@/types/service.types";

interface ServiceRowHeaderProps {
  service: Service;
}

export const ServiceRowHeader = ({ service }: ServiceRowHeaderProps) => {
  // Display URL for HTTP services, hostname for others
  const shouldDisplayFullUrl = service.type.toLowerCase() === "http";
  let serviceSubtitle = "";
  
  // Check alerts status - check both fields for backward compatibility
  const alertsMuted = service.alerts === "muted" || service.muteAlerts === true;
  
  if (service.url) {
    try {
      const url = service.url;
      // If the URL doesn't start with http:// or https://, add https:// prefix
      const formattedUrl = (!url.startsWith('http://') && !url.startsWith('https://')) 
        ? `https://${url}` 
        : url;

      try {
        // Now try to parse it as a URL
        const urlObj = new URL(formattedUrl);
        if (shouldDisplayFullUrl) {
          serviceSubtitle = formattedUrl;
        } else {
          serviceSubtitle = urlObj.hostname;
        }
      } catch (urlError) {
        // If URL parsing still fails, just show the original URL
        serviceSubtitle = url;
      }
    } catch (e) {
      // If any other error occurs, just show the original URL
      serviceSubtitle = service.url;
      console.log("Error processing URL:", e);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <div>
        <div className="text-base font-medium">{service.name}</div>
        {service.url && (
          <div className="text-sm text-gray-500 mt-1">{serviceSubtitle}</div>
        )}
      </div>
      {/* Add a visual indicator if alerts are muted for this service */}
      {alertsMuted && (
        <div className="ml-1" title="Alerts muted">
          <BellOff className="h-4 w-4 text-gray-400" />
        </div>
      )}
    </div>
  );
};
