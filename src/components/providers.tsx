"use client";

import { TooltipProvider } from "@radix-ui/react-tooltip";
import { ThemeProvider } from "./theme-provider";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <TooltipProvider>{children}</TooltipProvider>
    </ThemeProvider>
  );
};
