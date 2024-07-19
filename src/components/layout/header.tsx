import * as React from "react";
import Link from "next/link";
import { Paytone_One } from "next/font/google";

import { Button } from "../ui/button";
import { ThemeToggle } from "../theme-toggle";
import { Icons, iconVariants } from "../ui/icons";
import { Loader } from "../ui/loader";
import { UserProfile } from "../auth/user-profile";

export const Header = () => {
  return (
    <header className="mx-auto flex w-full">
      <Link href="/"></Link>

      <div className="flex items-center gap-2">
        <Button>
          <Link href="">
            <Icons.github className={iconVariants({ size: "lg" })} />
            <span className="sr-only">github repository</span>
          </Link>
        </Button>

        <ThemeToggle />

        <React.Suspense fallback={<Loader size="xl" />}>
          <UserProfile />
        </React.Suspense>
      </div>
    </header>
  );
};
