import { type UserWithLink } from "@/types";

import { Icons, iconVariants } from "../ui/icons";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "../ui/responsive-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";

type UserProfileDialogProps = {
  user: UserWithLink;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
};

export function UserProfileDialog({
  user,
  isOpen,
  onOpenChange,
}: UserProfileDialogProps) {
  const nameInitials = user.name
    ?.match(/\b(\w)/g)
    ?.join("")
    .slice(0, 2);

  return (
    <ResponsiveDialog open={isOpen} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Profile</ResponsiveDialogTitle>
        </ResponsiveDialogHeader>
      </ResponsiveDialogContent>

      <ResponsiveDialogBody className="flex flex-col items-center gap-4">
        <Avatar className="size-28">
          <AvatarImage src={user.image ?? ""} alt="User profile image" />
          <AvatarFallback>{nameInitials}</AvatarFallback>
        </Avatar>

        <div className="text-center">
          <div className="text-medium">{user.name}</div>
          <div className="text-muted-foreground">{user.email}</div>
        </div>

        <div className="flex w-full flex-col gap-3 p-4 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-between gap-2 text-muted-foreground">
              <Icons.Link className={iconVariants({ size: "sm" })} />
              Total Created links
            </div>
            <div>{user.userLink?.totalLinks ?? 0}</div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center justify-between gap-2 text-muted-foreground">
              <Icons.Calendar className={iconVariants({ size: "sm" })} />
              Joined
            </div>
            <div>
              {/* REVIEW: */}
              {new Intl.DateTimeFormat("en-US", {
                dateStyle: "full",
              }).format(new Date(user.createdAt))}
            </div>
          </div>
        </div>
      </ResponsiveDialogBody>
    </ResponsiveDialog>
  );
}
