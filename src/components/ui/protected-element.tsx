import * as React from "react";
import { type Session } from "next-auth";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

type ProtectedElementProps = {
  session?: Session | null;
  tooltipMessage: string;
  renderElement: (disabled: boolean) => React.ReactNode;
};

export function ProtectedElement({
  renderElement,
  tooltipMessage,
  session,
}: ProtectedElementProps) {
  const isUserLoggedIn = !!session;

  if (!isUserLoggedIn) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-not-allowed">{renderElement(true)}</div>
        </TooltipTrigger>

        <TooltipContent>
          <p>{tooltipMessage}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  // REVIEW:
  return renderElement(false);
}
