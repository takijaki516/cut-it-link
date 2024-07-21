"use server";

import { signIn, signOut } from "@/auth";
import { type BuiltInProviderType } from "next-auth/providers";

export async function nextAuthSignOut() {
  await signOut();
}

export async function nextAuthSignIn(provider: BuiltInProviderType) {
  await signIn(provider);
}
