"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button, type ButtonVariant } from "../ui/button";
import { Icons, iconVariants } from "../ui/icons";
import { type BuiltInProviderType } from "next-auth/providers";
import { nextAuthSignIn } from "@/lib/actions/auth";

const OAuthProviderButton = React.forwardRef<
  React.ElementRef<"button">,
  React.ComponentPropsWithoutRef<"button"> & {
    provider: BuiltInProviderType;
    handleSignin: (provider: BuiltInProviderType) => void;
    variant?: ButtonVariant["variant"];
    isLoading: boolean;
  }
>(
  (
    { provider, isLoading, handleSignin, variant, className, ...props },
    ref,
  ) => {
    const ProviderIcon = Icons[provider as keyof typeof Icons];

    return (
      <Button
        className={cn(className)}
        onClick={() => handleSignin(provider)}
        variant={variant}
        ref={ref}
        {...props}
      >
        {!isLoading && (
          <ProviderIcon className={iconVariants({ className: "mr-2" })} />
        )}
        {isLoading ? `Redireting to ${provider}` : `Continue with ${provider}`}
      </Button>
    );
  },
);

OAuthProviderButton.displayName = "OAuthProivderButton";

export { OAuthProviderButton };
