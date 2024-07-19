import "next-auth";
import type { User as NextAuthUser } from "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User extends NextAuthUser {}
}
