"use client";

import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";

import { deleteShortLink } from "@/lib/actions/link";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";

type DeleteLinkDialogProps = {
  slug: string;
  open?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
};

export function DeleteLinkDialog({
  slug,
  open,
  onOpenChange,
}: DeleteLinkDialogProps) {
  const { execute: deleteLink, status: deleteLinkStatus } = useAction(
    deleteShortLink,
    {
      onSuccess() {
        toast.success("Link deleted successfully");
        onOpenChange?.(false);
      },
      onError({ error }) {
        toast.error(error.serverError ?? error.fetchError);
      },
    },
  );

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[22rem] sm:max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the link.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            variant={"destructive"}
            onClick={() => deleteLink({ slug })}
            isLoading={deleteLinkStatus === "executing"}
          >
            {deleteLinkStatus === "executing"
              ? "Deleting link..."
              : "Delete link"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
