
import React from "react";
import { AlertTriangle } from "lucide-react";

interface ServiceRowResponseTimeProps {
  responseTime: number;
}

export const ServiceRowResponseTime = ({ responseTime }: ServiceRowResponseTimeProps) => {
  // Determine if response time is high (≥ 1000ms)
  const isResponseTimeHigh = responseTime >= 1000;

  return (
    <div className="font-mono text-base flex items-center gap-1.5">
      {responseTime > 0 ? (
        <>
          <span className={isResponseTimeHigh ? "text-amber-500 font-semibold" : ""}>
            {responseTime}ms
          </span>
          {isResponseTimeHigh && (
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          )}
        </>
      ) : 'N/A'}
    </div>
  );
};
