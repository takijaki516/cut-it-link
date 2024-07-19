"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { z } from "zod";

import { auth } from "@/auth";
import { redis } from "@/server/redis";
import {
  checkSlugExists,
  deleteLinkAndRevalidate,
  generateShortLink,
  updateLinkBySlug,
} from "@/server/api/link";
import { actionClient, authActionClient, MyCustomError } from "../safe-action";
import { editLinkSchema, insertLinkSchema } from "../validation/link";
import {
  createNewUserLink,
  getOrCreateUserLinkByUserId,
  getUserLinkByUserId,
  setUserLinkIdCookie,
} from "@/server/api/user-link";
import { UserLink } from "../db/schema";

export const createShortLink = actionClient
  .schema(insertLinkSchema)
  .action(async ({ parsedInput: { slug, url, description } }) => {
    const session = await auth();

    if (session) {
      const userLink = await getOrCreateUserLinkByUserId(session.user!.id!);
      await generateShortLink({
        userLinkId: userLink.id,
        slug,
        url,
        description,
      });
    } else {
      const cookieStore = cookies();
      const userLinkId = cookieStore.get("user-link-id")?.value;

      let userLink: UserLink | undefined;

      if (!userLinkId) {
        userLink = await createNewUserLink();
      } else {
        userLink = await getOrCreateUserLinkByUserId(userLinkId);
      }

      if (!userLink) {
        throw new MyCustomError("Error in creating user link");
      }

      // REVIEW:
      if (userLink.id !== userLinkId) {
        setUserLinkIdCookie(userLink.id);
      }

      await generateShortLink({
        url,
        userLinkId: userLink.id,
        isGuestUser: true,
        slug: "",
      });
    }

    revalidatePath("/");
    return { message: "Link creation successful" };
  });

export const deleteShortLink = actionClient
  .schema(
    z.object({
      slug: z.string(),
    }),
  )
  .action(async ({ parsedInput: { slug } }) => {
    const cookieStore = cookies();
    const userLinkIdCookie = cookieStore.get("user-link-id")?.value;
    if (userLinkIdCookie) {
      return await deleteLinkAndRevalidate(slug, userLinkIdCookie);
    }

    const session = await auth();
    if (!session) {
      throw new MyCustomError("Session not found!");
    }

    const userLink = await getUserLinkByUserId(session.user!.id!);
    if (!userLink) {
      throw new MyCustomError("User link not found!");
    }

    return await deleteLinkAndRevalidate(slug, userLink.id);
  });

export const editShortLink = authActionClient
  .schema(editLinkSchema)
  .action(async ({ parsedInput: { slug, newLink }, ctx: { userId } }) => {
    const newUrl = encodeURIComponent(newLink.url);
    const newSlug = newLink.slug;

    const userLink = await getUserLinkByUserId(userId);
    if (!userLink) {
      throw new MyCustomError("No user link found");
    }

    const link = userLink.links.find((link) => link.slug === slug);
    if (!link) {
      throw new MyCustomError("Link not found");
    }

    const updatePromises: Promise<any>[] = [];

    if (newSlug !== slug) {
      const slugExists = await checkSlugExists(newSlug);
      if (slugExists) {
        throw new MyCustomError("Slug already exits");
      }

      updatePromises.push(
        updateLinkBySlug(slug, newLink),
        redis.del(slug.toLowerCase()),
        redis.set(newSlug.toLowerCase(), newUrl),
      );
    } else {
      updatePromises.push(
        updateLinkBySlug(slug, {
          ...newLink,
          slug: slug, // REVIEW: 굳이 ....
        }),
      );

      if (newUrl !== link.url) {
        updatePromises.push(redis.set(slug.toLowerCase(), newUrl));
      }
    }

    await Promise.all(updatePromises);
    revalidatePath("/");
    return { message: "Link edited successfully" };
  });

// NOTE: redis check
export const checkSlug = authActionClient
  .schema(
    z.object({
      slug: z.string(),
    }),
  )
  .action(async ({ parsedInput: { slug } }) => {
    return await checkSlugExists(slug);
  });
