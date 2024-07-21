"use client";

import * as React from "react";

import { UserWithLink } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Loader } from "../ui/loader";
import { Icons, iconVariants } from "../ui/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { nextAuthSignOut } from "@/lib/actions/auth";
import { UserProfileDialog } from "./user-profile-dialog";

type UserProfileDropdownProps = {
  user: UserWithLink;
};

export function UserProfileDropdown({ user }: UserProfileDropdownProps) {
  const [isSignoutLoading, setIsSignoutLoading] = React.useState(false);
  const [isUserProfileDialogOpen, setIsUserProfileDialogOpen] =
    React.useState(false);

  const nameInitials = user.name
    ?.match(/\b(\w)/g)
    ?.join("")
    .slice(0, 2);

  async function handleSignOut(e: Event) {
    e.preventDefault();
    setIsSignoutLoading(true);
    await nextAuthSignOut();
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="rounded-full" size="icon" variant={"ghost"}>
            <Avatar className="size-9">
              <AvatarImage src={user.image ?? ""} alt="user profile image" />
              <AvatarFallback>{nameInitials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="min-w-52">
          <div className="flex p-1">
            <div className="relative">
              <Avatar className="size-9">
                <AvatarImage src={user.image ?? ""} alt="user Profile image" />
                <AvatarFallback>{nameInitials}</AvatarFallback>
              </Avatar>
              <div className="absolute bottom-[-1px] end-[-1px] rounded-full bg-background p-0.5">
                <div className="rounded-full bg-blue-500 p-1"></div>
              </div>
            </div>

            <div className="ms-2">
              <div className="truncate text-sm font-medium">{user.name}</div>
              <div className="truncate text-xs text-muted-foreground">
                {user.email}
              </div>
            </div>
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setIsUserProfileDialogOpen(true)}>
              <Icons.User className={iconVariants({ className: "me-2" })} />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Icons.Settings className={iconVariants({ className: "me-2" })} />
              Settings
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onSelect={handleSignOut}
            disabled={isSignoutLoading}
          >
            {isSignoutLoading ? (
              <>
                <Loader className="me-2" />
                Logging out...
              </>
            ) : (
              <>
                <Icons.LogOut className={iconVariants({ className: "me-2" })} />
                Logout
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UserProfileDialog
        user={user}
        isOpen={isUserProfileDialogOpen}
        onOpenChange={setIsUserProfileDialogOpen}
      />
    </>
  );
}
