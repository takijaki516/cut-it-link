import { eq } from "drizzle-orm";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import { cookies } from "next/headers";

import authConfig from "./auth.config";
import { db } from "./lib/db";
import { redis } from "./server/redis";
import {
  getLinksByUserLinkId,
  updateLinksByUserLinkId,
} from "./server/api/link";
import {
  createNewUserLink,
  getUserLinkById,
  getUserLinkByUserId,
  updateUserLink,
} from "./server/api/user-link";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
  events: {
    async signIn({ user }) {
      const cookieStore = cookies();
      const userLinkIdCookie = cookieStore.get("user-link-id")?.value;

      // REVIEW:
      if (!userLinkIdCookie) return;

      // TODO: fix user type
      const existingUserLink = await getUserLinkByUserId(user.id!);

      if (existingUserLink) {
        const links = await getLinksByUserLinkId(userLinkIdCookie);

        // REVIEW:
        const promises = links.map((link) =>
          redis.persist(link.slug.toLowerCase()),
        );

        await Promise.allSettled([
          ...promises,
          updateLinksByUserLinkId(userLinkIdCookie, {
            userLinkId: existingUserLink.id,
          }),
        ]);
      } else {
        const userLink = await getUserLinkById(userLinkIdCookie);
        if (userLink) {
          const promises = userLink.links.map((link) =>
            redis.persist(link.slug.toLowerCase()),
          );

          await Promise.allSettled([
            ...promises,
            updateUserLink(userLinkIdCookie, { userId: user.id! }),
          ]);
        } else {
          await createNewUserLink(user.id!);
        }
      }
      // REVIEW:
      cookies().delete("user-link-id");
    },
  },
  adapter: DrizzleAdapter(db),
  ...authConfig,
});
