import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { iconVariants, type IconVariants } from "./icons";

// REVIEW:
const loaderVariants = cva("animate-spin", {
  variants: {
    variant: {
      default: "",
      primary: "",
      destructive: "",
      secondary: "",
    },
    border: {
      xs: "",
      sm: "",
      base: "",
      lg: "",
      xl: "",
      "2xl": "",
      "3xl": "",
      "4xl": "",
      "5xl": "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export type LoaderVariant = VariantProps<typeof loaderVariants>;

const Loader = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & LoaderVariant & IconVariants
>(({ variant, size = "base", className, ...props }, ref) => (
  <div
    className={cn(
      loaderVariants({ variant, border: size, className }),
      iconVariants({ size }),
    )}
    ref={ref}
    {...props}
  />
));

Loader.displayName = "Loader";

export { Loader };
