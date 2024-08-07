import { cookies } from "next/headers";
import { desc, eq, sql } from "drizzle-orm";

import { MyCustomError } from "@/lib/safe-action";
import { GUEST_LINK_COOKIE_EXPIRATION_TIME } from "@/lib/config";
import { links, ShortLink, UserLink, userLinks } from "@/lib/db/schema";
import { db } from "@/lib/db";

export async function createNewUserLink(
  userId?: string,
): Promise<UserLink | undefined> {
  const newUserLink = await db.insert(userLinks).values({ userId }).returning();
  return newUserLink[0];
}

export async function getUserLinkById(
  id: string,
): Promise<(UserLink & { links: ShortLink[] }) | undefined> {
  const userLink = await db.query.userLinks.findFirst({
    where: eq(userLinks.id, id),
    with: {
      links: {
        orderBy: desc(links.createdAt),
      },
    },
  });

  return userLink;
}

export async function getUserLinkByUserId(
  userId: string,
): Promise<(UserLink & { links: ShortLink[] }) | undefined> {
  const userLink = await db.query.userLinks.findFirst({
    where: eq(userLinks.userId, userId),
    with: {
      links: {
        orderBy: desc(links.createdAt),
      },
    },
  });

  return userLink;
}

export async function getOrCreateUserLinkByUserId(
  userId: string,
): Promise<UserLink> {
  const userLink = await getUserLinkByUserId(userId);
  if (userLink) {
    return userLink;
  }

  const newUserLink = await createNewUserLink(userId);
  if (!newUserLink) {
    throw new MyCustomError("Error in creating user link");
  }

  return newUserLink;
}

export async function getOrCreateUserLinkById(id: string): Promise<UserLink> {
  const userLink = await getUserLinkById(id);
  if (userLink) {
    return userLink;
  }

  const newUserLink = await createNewUserLink();
  if (!newUserLink) {
    throw new MyCustomError("Error in creating user link");
  }

  return newUserLink;
}

export async function updateUserLink(
  id: string,
  data: Partial<UserLink>,
): Promise<UserLink | undefined> {
  const updatedUserLink = await db
    .update(userLinks)
    .set(data)
    .where(eq(userLinks.id, id))
    .returning();

  return updatedUserLink[0];
}

// REVIEW:
export function setUserLinkIdCookie(id: string) {
  const cookieStore = cookies();

  cookieStore.set("user-link-id", id, {
    expires: new Date(Date.now() + GUEST_LINK_COOKIE_EXPIRATION_TIME),
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    httpOnly: true,
  });
}

export async function deleteExpiredUserLinks() {
  await db.execute(
    sql`DELETE FROM userLink WHERE userId is NULL AND created_at < (CURRENT_TIMESTAMP - INTERVAL '1 day')`,
  );
}
