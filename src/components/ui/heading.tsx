import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const headingVariants = cva("text-balance", {
  variants: {
    variant: {
      h1: "",
      h2: "",
      h3: "",
      h4: "",
      h5: "",
      h6: "",
    },
    isFirstBlock: {
      true: "mt-0",
      false: "",
    },
  },
});

const Heading = React.forwardRef<
  React.ElementRef<"h1">,
  React.ComponentPropsWithRef<"h1"> & VariantProps<typeof headingVariants>
>(({ className, variant, isFirstBlock, ...props }, ref) => {
  const Element = variant!;

  return (
    <Element
      ref={ref}
      className={cn(headingVariants({ variant, isFirstBlock, className }))}
      {...props}
    />
  );
});

Heading.displayName = "Heading";

export { Heading, headingVariants };
