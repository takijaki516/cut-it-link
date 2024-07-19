import { revalidatePath } from "next/cache";
import { type SetCommandOptions } from "@upstash/redis";
import { and, desc, eq, gte, lte, sql } from "drizzle-orm";

import { redis } from "../redis";
import { GUEST_LINK_EXPIRE_TIME } from "@/lib/config";
import { MyCustomError } from "@/lib/safe-action";
import { links, NewShortLink, ShortLink, userLinks } from "@/lib/db/schema";
import { nanoid } from "@/lib/utils";
import { db } from "@/lib/db";

// NOTE: 중복 체크
export async function generateRandomSlug(): Promise<string> {
  const slug = nanoid();
  const link = await checkSlugExists(slug);
  if (link) {
    return generateRandomSlug();
  }
  return slug;
}

// REVIEW:
export async function checkSlugExists(slug: string): Promise<boolean> {
  return Boolean(await redis.exists(slug.toLowerCase()));
}

// REVIEW:
export async function getLinkBySlug(
  slug: string,
): Promise<ShortLink | undefined> {
  const link = await db.query.links.findFirst({
    where: eq(links.slug, slug).append(sql`COLLATE NOCASE`),
  });

  return link;
}

export async function getLinksByUserLinkId(
  userLinkId: string,
): Promise<ShortLink[]> {
  const currentDate = new Date();
  const oneDayAgo = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000); // one day age

  const shortLinks = await db.query.links.findMany({
    where: and(
      eq(links.userLinkId, userLinkId),
      gte(links.createdAt, oneDayAgo),
      lte(links.createdAt, currentDate),
    ),
    orderBy: desc(links.createdAt),
  });

  return shortLinks;
}

export async function generateShortLink({
  slug,
  url,
  userLinkId,
  isGuestUser,
  description,
}: NewShortLink & { isGuestUser?: boolean }): Promise<void> {
  const encodedUrl = encodeURIComponent(url);

  if (slug) {
    const link = await checkSlugExists(slug);
    if (link) {
      throw new MyCustomError("Slug already exists");
    }
  } else {
    slug = await generateRandomSlug();
  }

  const redisOptions: SetCommandOptions | undefined = isGuestUser
    ? { ex: GUEST_LINK_EXPIRE_TIME }
    : undefined;

  await Promise.all([
    db
      .insert(links)
      .values({ slug, url: encodedUrl, userLinkId, description })
      .execute(),
    db
      .update(userLinks)
      .set({
        totalLinks: sql`${userLinks.totalLinks} + 1`,
      })
      .where(eq(userLinks.id, userLinkId))
      .execute(),
    redis.set(slug.toLowerCase(), encodedUrl, redisOptions),
  ]);
}

export async function deleteLink(
  slug: string,
  userLinkId: string,
): Promise<void> {
  const link = await getLinkBySlug(slug);

  if (!link) {
    throw new MyCustomError("Link not found");
  }

  if (link.userLinkId !== userLinkId) {
    throw new MyCustomError("Link not found");
  }

  // REVIEW: what is execute?
  await Promise.all([
    db.delete(links).where(eq(links.slug, slug)).execute(),
    redis.del(slug.toLowerCase()),
  ]);
}

export async function deleteLinkAndRevalidate(slug: string, id: string) {
  await deleteLink(slug, id);
  revalidatePath("/");
  return { message: "Link deleted successfully" };
}

export async function updateLinkBySlug(
  slug: string,
  newLink: Partial<NewShortLink>,
) {
  const updatedLink = await db
    .update(links)
    .set(newLink)
    .where(eq(links.slug, slug))
    .returning();

  return updatedLink[0];
}

export async function updateLinksByUserLinkId(
  userLinkId: string,
  data: Partial<ShortLink>,
): Promise<void> {
  await db
    .update(links)
    .set(data)
    .where(eq(links.userLinkId, userLinkId))
    .execute();
}

// NOTE: guest로 생성된 링크를 삭제한다.
export async function deleteExpiredLinks() {
  await db.execute(
    sql`DELETE FROM link WHERE userLinkId IN (SELECT id FROM userLink WHERE userId is NULL) AND created_at < (CURRENT_TIMESTAMP - INTERVAL '1 day')`,
  );
}
