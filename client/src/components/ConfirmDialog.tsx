import * as React from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  destructive = false,
  onConfirm,
  isPending,
  "data-testid": dataTestId,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
  onConfirm: () => void;
  isPending?: boolean;
  "data-testid"?: string;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-3xl border-border/70">
        <AlertDialogHeader>
          <AlertDialogTitle data-testid={dataTestId ? `${dataTestId}-title` : undefined}>{title}</AlertDialogTitle>
          <AlertDialogDescription data-testid={dataTestId ? `${dataTestId}-desc` : undefined}>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-3">
          <AlertDialogCancel asChild>
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() => onOpenChange(false)}
              data-testid={dataTestId ? `${dataTestId}-cancel` : undefined}
            >
              {cancelText}
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              type="button"
              className={
                destructive
                  ? "rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : "rounded-xl bg-gradient-to-r from-primary to-primary/85 text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg btn-sheen"
              }
              onClick={onConfirm}
              disabled={isPending}
              data-testid={dataTestId ? `${dataTestId}-confirm` : undefined}
            >
              {isPending ? "Working..." : confirmText}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
