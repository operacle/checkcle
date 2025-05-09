
import { NotificationTemplate } from "../templateService";

/**
 * Process a notification template with service data
 */
export function processTemplate(
  template: NotificationTemplate,
  service: any,
  status: string,
  responseTime?: number
): string {
  try {
    console.log(`Processing template for status: ${status}`);
    
    let templateText = "";
    
    // Select the appropriate message template based on status
    if (status === "up") {
      templateText = template.up_message || `Service ${service.name} is now UP`;
    } else if (status === "down") {
      templateText = template.down_message || `Service ${service.name} is DOWN`;
    } else if (status === "warning") {
      templateText = template.incident_message || `Warning: Service ${service.name} has an incident`;
    } else if (status === "maintenance" || status === "paused") {
      templateText = template.maintenance_message || `Service ${service.name} is in maintenance mode`;
    } else if (status === "resolved") {
      templateText = template.resolved_message || `Issue with service ${service.name} has been resolved`;
    } else {
      templateText = `Service ${service.name} status changed to: ${status}`;
    }
    
    // Skip replacement if template is empty
    if (!templateText) {
      console.log("Empty template for status:", status);
      return generateDefaultMessage(service.name, status, responseTime);
    }
    
    console.log("Using template text:", templateText);
    
    // Replace placeholders with actual values
    let message = templateText
      .replace(/\${service_name}/g, service.name || 'Unknown Service')
      .replace(/\${status}/g, status.toUpperCase());
    
    // Add response time if available
    if (responseTime !== undefined) {
      message = message.replace(/\${response_time}/g, `${responseTime}ms`);
    } else {
      message = message.replace(/\${response_time}/g, 'N/A');
    }
    
    // Replace any other placeholders
    message = message
      .replace(/\${threshold}/g, service.threshold || 'N/A')
      .replace(/\${url}/g, service.url || 'N/A')
      .replace(/\${time}/g, new Date().toLocaleString());
      
    console.log("Processed template message:", message);
    return message;
  } catch (error) {
    console.error("Error processing template:", error);
    return generateDefaultMessage(service.name, status, responseTime);
  }
}

/**
 * Generate a default message when no template is available
 */
export function generateDefaultMessage(
  serviceName: string,
  status: string,
  responseTime?: number
): string {
  const statusText = status.toUpperCase();
  
  let message = `Service ${serviceName || 'Unknown'} is ${statusText}`;
  
  if (responseTime !== undefined) {
    message += `. Response time: ${responseTime}ms`;
  }
  
  message += `. Time: ${new Date().toLocaleString()}`;
  
  return message;
}
