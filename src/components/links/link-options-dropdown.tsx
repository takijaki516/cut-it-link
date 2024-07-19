"use client";

import * as React from "react";
import { type Session } from "next-auth";
import { type ShortLink } from "@/lib/db/schema";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Icons, iconVariants } from "../ui/icons";
import { Button } from "../ui/button";
import { CustomLinkDialog } from "./custom-link-dialog";
import { DeleteLinkDialog } from "./delete-link-dialog";
import { ProtectedElement } from "../ui/protected-element";

type LinkOptionsDropdownProps = {
  link: ShortLink;
  session?: Session | null;
};

export function LinkOptionsDropdownProps({
  link,
  session,
}: LinkOptionsDropdownProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isEditLinkDialogOpen, setIsEditLinkDialogOpen] = React.useState(false);
  const [isQRCodeDialogOpen, setIsQRCodeDialogOpen] = React.useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant={"outline"} size="icon">
            <Icons.MoreVertical className={iconVariants()} />
            <span className="sr-only">Link actions menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsQRCodeDialogOpen(true)}>
            <Icons.QrCode />
            QR Code
          </DropdownMenuItem>

          <ProtectedElement
            session={session}
            tooltipMessage="Sign in to edit links"
            renderElement={(disabled) => (
              <DropdownMenuItem
                onClick={() => setIsEditLinkDialogOpen(true)}
                disabled={disabled}
              >
                <Icons.Pencil className={iconVariants({ className: "mr-2" })} />
                Edit
              </DropdownMenuItem>
            )}
          />

          <DropdownMenuItem
            className="text-red-500 focus:bg-red-500/10 focus:text-red-500"
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={link.slug === "github"}
          >
            <Icons.Trash2 className={iconVariants({ className: "mr-2" })} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteLinkDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        slug={link.slug}
      />
      <CustomLinkDialog
        open={isEditLinkDialogOpen}
        onOpenChange={setIsEditLinkDialogOpen}
        defaultValues={link}
        isEditing
      />
    </>
  );
}
