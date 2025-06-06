
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface TestEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSendTest: (data: TestEmailData) => Promise<void>;
  isTesting: boolean;
}

export interface TestEmailData {
  email: string;
  template: string;
  collection?: string;
}

const TestEmailDialog: React.FC<TestEmailDialogProps> = ({
  open,
  onOpenChange,
  onSendTest,
  isTesting
}) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [template, setTemplate] = useState('verification');
  const [collection, setCollection] = useState('_superusers');

  const handleSend = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await onSendTest({
        email,
        template,
        collection: template === 'verification' ? collection : undefined
      });
      
      toast({
        title: "Success",
        description: "Test email sent successfully",
        variant: "default",
      });
      
      // Close dialog on success
      handleClose();
    } catch (error) {
      console.error('Error sending test email:', error);
      toast({
        title: "Error",
        description: "Failed to send test email",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset form
    setEmail('');
    setTemplate('verification');
    setCollection('_superusers');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            {t("sendTestEmail", "settings")}
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Template Selection */}
          <div className="space-y-3">
            <Label>{t("emailTemplate", "settings")}</Label>
            <RadioGroup value={template} onValueChange={setTemplate}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="verification" id="verification" />
                <Label htmlFor="verification">{t("verification", "settings")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="password-reset" id="password-reset" />
                <Label htmlFor="password-reset">{t("passwordReset", "settings")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email-change" id="email-change" />
                <Label htmlFor="email-change">{t("confirmEmailChange", "settings")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="otp" id="otp" />
                <Label htmlFor="otp">{t("otp", "settings")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="login-alert" id="login-alert" />
                <Label htmlFor="login-alert">{t("loginAlert", "settings")}</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Auth Collection - only show for verification template */}
          {template === 'verification' && (
            <div className="space-y-2">
              <Label>{t("authCollection", "settings")} *</Label>
              <Select value={collection} onValueChange={setCollection}>
                <SelectTrigger>
                  <SelectValue placeholder={t("selectCollection", "settings")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_superusers">_superusers</SelectItem>
                  <SelectItem value="users">users</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Email Address */}
          <div className="space-y-2">
            <Label>{t("toEmailAddress", "settings")} *</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("enterEmailAddress", "settings")}
              required
            />
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={handleClose}>
            {t("close", "common")}
          </Button>
          <Button 
            onClick={handleSend} 
            disabled={!email || isTesting}
            className="flex items-center gap-2"
          >
            <Mail className="h-4 w-4" />
            {isTesting ? t("sending", "settings") : t("send", "common")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TestEmailDialog;