import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { UserWithLink } from "@/types";

export async function getUserById(
  id: string,
): Promise<UserWithLink | undefined> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
    with: {
      userLink: true,
    },
  });

  return user;
}
