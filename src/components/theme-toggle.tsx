"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Icons, iconVariants } from "./ui/icons";

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"outline"} size="icon">
          <Icons.Sun
            className={iconVariants({
              size: "base",
              className:
                "absolute rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0",
            })}
          />
          <Icons.Moon
            className={iconVariants({
              size: "base",
              className:
                "absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100",
            })}
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
