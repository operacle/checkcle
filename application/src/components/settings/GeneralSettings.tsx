
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";
import { settingsService, type GeneralSettings } from "@/services/settingsService";
import { useToast } from "@/hooks/use-toast";

const GeneralSettingsPanel = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<GeneralSettings>>({});
  const [isEditing, setIsEditing] = useState(false);

  const { data: settings, isLoading, error, refetch } = useQuery({
    queryKey: ['generalSettings'],
    queryFn: settingsService.getGeneralSettings,
  });

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!settings?.id || !formData) return;
    
    try {
      const result = await settingsService.updateGeneralSettings(settings.id, formData);
      if (result) {
        toast({
          title: "Settings updated",
          description: "Your settings have been updated successfully.",
          variant: "default",
        });
        refetch();
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      toast({
        title: "Update failed",
        description: "There was a problem updating your settings.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading settings...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error loading settings</div>;
  }

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
          <CardDescription>
            Configure your system settings and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="system_name">System Name</Label>
            <Input 
              id="system_name"
              name="system_name"
              value={formData?.system_name || ''}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="My Monitoring System"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit Settings</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default GeneralSettingsPanel;
