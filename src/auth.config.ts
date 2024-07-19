import type { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";

export default {
  providers: [GithubProvider, GoogleProvider],
} satisfies NextAuthConfig;
