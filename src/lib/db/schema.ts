import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";
import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),

  //
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;

export const usersRelations = relations(users, ({ many, one }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  userLink: one(userLinks, {
    fields: [users.id],
    references: [userLinks.userId],
  }),
}));

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),

    //
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("accounts_userId_idx").on(account.userId),
  }),
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),

  //
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),

    //
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  }),
);

// REVIEW:
export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  }),
);

export const userLinks = pgTable(
  "userLink",
  {
    id: text("id")
      .$defaultFn(() => createId())
      .primaryKey(),
    userId: text("userId").references(() => users.id, { onDelete: "cascade" }), // NOTE: can be null is user id guest
    totalLinks: integer("total_links").default(0).notNull(),
    //
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (link) => ({
    // REVIEW:
    userIdIdx: uniqueIndex("userLinks_userId_Idx").on(link.userId),
  }),
);

export type UserLink = typeof userLinks.$inferSelect;
export type NewUserLink = typeof userLinks.$inferInsert;

export const userLinksRelations = relations(userLinks, ({ many, one }) => ({
  user: one(users, { fields: [userLinks.userId], references: [users.id] }),
  links: many(links),
}));

export const links = pgTable(
  "link",
  {
    slug: text("slug").primaryKey(),
    userLinkId: text("userLinkId")
      .references(() => userLinks.id, {
        onDelete: "cascade",
      })
      .notNull(),
    description: text("description"),
    url: text("url").notNull(),
    clicks: integer("clicks").default(0).notNull(),

    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (links) => ({
    userLinkIdIdx: index("userLinkId_idx").on(links.userLinkId),
  }),
);

export type ShortLink = typeof links.$inferSelect;
export type NewShortLink = typeof links.$inferInsert;

export const linksRelation = relations(links, ({ one }) => ({
  userLink: one(userLinks, {
    fields: [links.userLinkId],
    references: [userLinks.id],
  }),
}));
