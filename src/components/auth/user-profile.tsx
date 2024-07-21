import { auth } from "@/auth";
import { getUserById } from "@/server/api/user";
import { Button } from "../ui/button";
import { SigninDialog } from "./signin-dialog";
import { UserProfileDropdown } from "./user-profile-dropdown";

function renderSigninDialog() {
  return (
    <SigninDialog>
      <Button size="sm">Sign In</Button>
    </SigninDialog>
  );
}

export async function UserProfile() {
  const session = await auth();
  if (!session) {
    return renderSigninDialog();
  }

  // REVIEW:
  const user = await getUserById(session.user!.id!);
  if (!user) {
    return renderSigninDialog();
  }

  return <UserProfileDropdown user={user} />;
}
