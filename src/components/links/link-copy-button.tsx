"use client";

import { toast } from "sonner";

import { Icons, iconVariants } from "../ui/icons";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";

type LinkCopyButtonProps = {
  textToCopy: string;
};

export function LinkCopyButton({ textToCopy }: LinkCopyButtonProps) {
  const handleCopy = async () => {
    navigator.clipboard.writeText(textToCopy);
    toast("Copied to clipboard");
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          aria-label="Copy to clipboard"
          size="icon"
          variant={"outline"}
        >
          <Icons.Copy
            className={iconVariants({ size: "sm" })}
            onClick={handleCopy}
          />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p className="font-sans">Copy link to clipboard</p>
      </TooltipContent>
    </Tooltip>
  );
}
