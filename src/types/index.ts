import { type User, type UserLink } from "@/lib/db/schema";

export type UserWithLink = User & { userLink?: UserLink };

// REVIEW:
export type SafeActionError = {
  serverError?: string;
  fetchError?: string;
  validationError?: Record<string, string[]>;
};
