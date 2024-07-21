import * as React from "react";
import Link from "next/link";
import { Paytone_One } from "next/font/google";

import { Button } from "../ui/button";
import { ThemeToggle } from "../theme-toggle";
import { Icons, iconVariants } from "../ui/icons";
import { Loader } from "../ui/loader";
import { UserProfile } from "../auth/user-profile";

const payToneOne = Paytone_One({ subsets: ["latin"], weight: ["400"] });

export const Header = () => {
  return (
    <header className="mx-auto flex w-full max-w-5xl items-center justify-between p-4">
      <Link href="/" className={`${payToneOne.className} text-3xl`}>
        HomePage
      </Link>

      <div className="flex items-center gap-2">
        <Button
          variant={"ghost"}
          size="icon"
          className="text-muted-foreground transition-colors hover:text-foreground"
          asChild
        >
          <Link href="https://github.com/" target="_blank">
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
