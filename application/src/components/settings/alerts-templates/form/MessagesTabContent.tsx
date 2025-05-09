
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";

interface MessagesTabContentProps {
  control: Control<any>;
}

export const MessagesTabContent: React.FC<MessagesTabContentProps> = ({ control }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <FormField
              control={control}
              name="up_message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Up Message</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Service ${service_name} is UP. Response time: ${response_time}ms" 
                      className="min-h-24"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Message sent when a service returns to UP status
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={control}
              name="down_message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Down Message</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Service ${service_name} is DOWN. Status: ${status}" 
                      className="min-h-24"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Message sent when a service goes DOWN
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={control}
              name="maintenance_message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maintenance Message</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Service ${service_name} is under maintenance" 
                      className="min-h-20"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={control}
              name="incident_message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Incident Message</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Warning: Service ${service_name} has an incident" 
                      className="min-h-20"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={control}
              name="resolved_message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resolved Message</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Issue with service ${service_name} has been resolved" 
                      className="min-h-20"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
