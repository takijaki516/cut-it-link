"use client";

import * as React from "react";
import { type ShortLink } from "@/lib/db/schema";

import { Button } from "../ui/button";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "../ui/responsive-dialog";
import { CustomLinkButton } from "./custom-link-button";
import { CustomLinkForm } from "./custom-link-form";

// NOTE: typescript type 4 combination type
type CustomLinkDialogProps = (
  | { isEditing: boolean; defaultValues: ShortLink }
  | { isEditing?: undefined; defaultValues?: undefined }
) &
  (
    | { open: boolean; onOpenChange: (isOpen: boolean) => void }
    | { open?: undefined; onOpenChange?: undefined }
  );

export function CustomLinkDialog({
  open = false,
  onOpenChange,
  isEditing = false,
  defaultValues,
}: CustomLinkDialogProps) {
  const [isOpen, setIsOpen] = React.useState(open);
  const isControlled = onOpenChange !== undefined;

  function handleOpenChange(isOpen: boolean) {
    if (!isControlled) {
      setIsOpen(isOpen);
      return;
    }
    onOpenChange(isOpen);
  }

  const openState = isControlled ? open : isOpen;

  return (
    <ResponsiveDialog open={openState} onOpenChange={handleOpenChange}>
      {!isEditing && (
        <ResponsiveDialogTrigger asChild>
          <CustomLinkButton />
        </ResponsiveDialogTrigger>
      )}

      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {isEditing ? "Edit Link" : "Create a new link"}
          </ResponsiveDialogTitle>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody>
          <CustomLinkForm
            isEditing={isEditing}
            defaultValues={defaultValues}
            onSetIsDialogOpen={handleOpenChange}
          />
        </ResponsiveDialogBody>

        {/* REVIEW: */}
        <ResponsiveDialogFooter>
          <ResponsiveDialogClose asChild>
            <Button variant={"outline"}>Cancel</Button>
          </ResponsiveDialogClose>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
