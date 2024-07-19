import { createSafeActionClient } from "next-safe-action";
import { auth } from "@/auth";

export class MyCustomError extends Error {}

export const actionClient = createSafeActionClient({
  handleReturnedServerError(e) {
    if (e instanceof MyCustomError) {
      return e.message;
    }
    return "Internal Server Error";
  },
});

export const authActionClient = createSafeActionClient({
  handleReturnedServerError(e) {
    if (e instanceof MyCustomError) {
      return e.message;
    }
    return "Internal server Error";
  },
}).use(async ({ next }) => {
  const session = await auth();

  if (!session) {
    throw new Error("Session not found!");
  }

  // REVIEW: type
  return next({ ctx: { userId: session.user!.id! } });
});
