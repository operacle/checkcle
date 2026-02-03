import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { copyToClipboard } from "@/utils/copyUtils";

interface ImpersonationTokenDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  token: string | null;
  impersonatedUserLabel?: string;
}

const ImpersonationTokenDialog = ({
  open,
  onOpenChange,
  token,
  impersonatedUserLabel,
}: ImpersonationTokenDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] w-[95vw]">
        <DialogHeader>
          <DialogTitle>Impersonation token</DialogTitle>
          <DialogDescription>
            {impersonatedUserLabel
              ? `Use this token to impersonate ${impersonatedUserLabel}. Keep it secret.`
              : "Use this token to impersonate the selected user. Keep it secret."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <div className="rounded-md border bg-muted p-3">
            <pre className="text-sm overflow-x-auto whitespace-pre-wrap break-all">
              <code>{token ?? ""}</code>
            </pre>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button
            type="button"
            onClick={() => {
              if (token) copyToClipboard(token);
            }}
            disabled={!token}
          >
            Copy token
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImpersonationTokenDialog;
