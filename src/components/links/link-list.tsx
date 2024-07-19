import { cookies } from "next/headers";
import { auth } from "@/auth";
import { ShortLink } from "@/lib/db/schema";
import { getLinkBySlug, getLinksByUserLinkId } from "@/server/api/link";
import { Session } from "next-auth";
import { getUserLinkByUserId } from "@/server/api/user-link";
import { SigninDialog } from "../auth/signin-dialog";
import { LinkCard } from "./link-card";

async function fetchLinksBySessionOrCookie(
  session: Session | null,
): Promise<ShortLink[]> {
  const cookieStore = cookies();

  if (session) {
    const userLink = await getUserLinkByUserId(session.user!.id!);
    return userLink?.links ?? [];
  } else {
    const userLinkIdCookie = cookieStore.get("user-link-id")?.value;
    if (!userLinkIdCookie) {
      return [];
    }

    return await getLinksByUserLinkId(userLinkIdCookie);
  }
}

export async function LinkList() {
  const session = await auth();

  let shortLinks: ShortLink[] = [];
  let defaultAppLink: ShortLink | undefined;

  if (!session) {
    defaultAppLink = await getLinkBySlug("github");
  }

  try {
    shortLinks = await fetchLinksBySessionOrCookie(session);
  } catch (err) {
    throw new Error("Failed to fetch links");
  }

  return (
    <>
      <div className="flex w-full flex-col gap-2">
        {defaultAppLink && <LinkCard link={defaultAppLink} />}
        {shortLinks.map((link) => (
          <LinkCard key={link.slug} link={link} session={session} />
        ))}
      </div>

      {!session && shortLinks.length > 0 && (
        <div className="px-4 text-xs text-muted-foreground">
          Maximize
          <SigninDialog>
            <span className="cursor-pointer text-foreground underline underline-offset-4">
              signing in
            </span>
          </SigninDialog>{" "}
          and accessing exclusive editing features!
        </div>
      )}
    </>
  );
}
