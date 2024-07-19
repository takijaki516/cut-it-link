"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { OAuthProviderButton } from "./oauth-provider-button";

export function SigninDialog({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  const [] = React.useState();

  async function handleSignin() {}

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader className="space-y-4">
          <DialogTitle>Sign In</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex flex-col gap-2">
          <OAuthProviderButton />
          <OAuthProviderButton />
        </div>
      </DialogContent>
    </Dialog>
  );
}
