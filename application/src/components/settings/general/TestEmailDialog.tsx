import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, X, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const [lastResult, setLastResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isInternalTesting, setIsInternalTesting] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSend = async () => {
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }
    
    if (!validateEmail(email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLastResult(null);
      setIsInternalTesting(true);
      
      console.log('Sending test email with data:', {
        email,
        template,
        collection: template === 'verification' || template === 'password-reset' ? collection : undefined
      });
      
      await onSendTest({
        email,
        template,
        collection: template === 'verification' || template === 'password-reset' ? collection : undefined
      });
      
      setLastResult({
        success: true,
        message: `Test email sent successfully to ${email}`
      });
      
      toast({
        title: "Success",
        description: `Test email sent successfully to ${email}`,
        variant: "default",
      });
      
    } catch (error) {
      console.error('Error sending test email:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to send test email";
      
      setLastResult({
        success: false,
        message: errorMessage
      });
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsInternalTesting(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset form but keep last result for reference
    setEmail('');
    setTemplate('verification');
    setCollection('_superusers');
    // Don't reset lastResult immediately to allow user to see the result
    setTimeout(() => setLastResult(null), 300);
  };

  const isLoading = isTesting || isInternalTesting;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            {t("sendTestEmail", "settings")}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Show last result */}
          {lastResult && (
            <Alert variant={lastResult.success ? "default" : "destructive"}>
              {lastResult.success ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>
                {lastResult.message}
              </AlertDescription>
            </Alert>
          )}

          {/* Template Selection */}
          <div className="space-y-3">
            <Label>{t("emailTemplate", "settings")}</Label>
            <RadioGroup value={template} onValueChange={setTemplate} disabled={isLoading}>
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
            </RadioGroup>
          </div>

          {/* Auth Collection - show for verification and password-reset templates */}
          {(template === 'verification' || template === 'password-reset') && (
            <div className="space-y-2">
              <Label>{t("authCollection", "settings")} *</Label>
              <Select value={collection} onValueChange={setCollection} disabled={isLoading}>
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
              disabled={isLoading}
            />
          </div>

          {/* Info message */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              This will send a test email using your configured SMTP settings. Make sure SMTP is properly configured first.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            {t("close", "common")}
          </Button>
          <Button 
            onClick={handleSend} 
            disabled={!email || isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Mail className="h-4 w-4" />
            )}
            {isLoading ? t("sending", "settings") : t("send", "common")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TestEmailDialog;