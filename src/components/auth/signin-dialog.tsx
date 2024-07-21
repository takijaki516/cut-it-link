"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { type BuiltInProviderType } from "next-auth/providers";

import { nextAuthSignIn } from "@/lib/actions/auth";
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

  const [signinProvider, setSigninProvider] =
    React.useState<BuiltInProviderType>();

  async function handleSignin(provider: BuiltInProviderType) {
    setSigninProvider(provider);
    await nextAuthSignIn(provider);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-[22rem] sm:max-w-sm">
        <DialogHeader className="space-y-4">
          <DialogTitle>Sign In</DialogTitle>
          <DialogDescription>
            Sign In for unlimited link lifespan and extra options
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex flex-col gap-2">
          <OAuthProviderButton
            provider="google"
            handleSignin={handleSignin}
            isLoading={signinProvider === "google"}
            variant={theme === "dark" ? "secondary" : "default"}
          />
          <OAuthProviderButton
            provider="github"
            handleSignin={handleSignin}
            isLoading={signinProvider === "github"}
            variant={theme === "dark" ? "secondary" : "default"}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
