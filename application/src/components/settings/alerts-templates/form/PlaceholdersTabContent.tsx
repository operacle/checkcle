
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PlaceholdersTabContentProps {
  control: Control<any>;
}

export const PlaceholdersTabContent: React.FC<PlaceholdersTabContentProps> = ({ control }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Template Placeholders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="service_name_placeholder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Name Placeholder</FormLabel>
                  <FormControl>
                    <Input placeholder="${service_name}" {...field} />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Used for service name in messages
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={control}
              name="response_time_placeholder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Response Time Placeholder</FormLabel>
                  <FormControl>
                    <Input placeholder="${response_time}" {...field} />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Used for response time in milliseconds
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          
            <FormField
              control={control}
              name="status_placeholder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status Placeholder</FormLabel>
                  <FormControl>
                    <Input placeholder="${status}" {...field} />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Used for service status (UP, DOWN, etc.)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={control}
              name="threshold_placeholder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Threshold Placeholder</FormLabel>
                  <FormControl>
                    <Input placeholder="${threshold}" {...field} />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Used for threshold values in alerts
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Placeholder Usage Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            These placeholders will be replaced with actual values when notifications are sent:
          </p>
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-muted/30 p-2 rounded">
                <code className="text-xs">${"{service_name}"}</code>
                <p className="text-xs text-muted-foreground mt-1">The name of the service</p>
              </div>
              <div className="bg-muted/30 p-2 rounded">
                <code className="text-xs">${"{response_time}"}</code>
                <p className="text-xs text-muted-foreground mt-1">Response time in milliseconds</p>
              </div>
              <div className="bg-muted/30 p-2 rounded">
                <code className="text-xs">${"{status}"}</code>
                <p className="text-xs text-muted-foreground mt-1">Service status (UP, DOWN)</p>
              </div>
              <div className="bg-muted/30 p-2 rounded">
                <code className="text-xs">${"{threshold}"}</code>
                <p className="text-xs text-muted-foreground mt-1">Service threshold value</p>
              </div>
              <div className="bg-muted/30 p-2 rounded">
                <code className="text-xs">${"{url}"}</code>
                <p className="text-xs text-muted-foreground mt-1">Service URL</p>
              </div>
              <div className="bg-muted/30 p-2 rounded">
                <code className="text-xs">${"{time}"}</code>
                <p className="text-xs text-muted-foreground mt-1">Current date and time</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
