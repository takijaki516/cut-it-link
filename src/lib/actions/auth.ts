"use server";

import { signOut } from "@/auth";

export async function nextAuthSignOut() {
  await signOut();
}
