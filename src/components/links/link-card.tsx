import Image from "next/image";
import { type Session } from "next-auth";
import { formatDistanceToNowStrict } from "date-fns";

import { type ShortLink } from "@/lib/db/schema";
import { Card, CardContent } from "../ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { formatNumber, getBaseUrl } from "@/lib/utils";
import { Icons, iconVariants } from "../ui/icons";
import { LinkCopyButton } from "./link-copy-button";
import { Button } from "../ui/button";
import { LinkOptionsDropdownProps } from "./link-options-dropdown";

type LinkCardProps = {
  link: ShortLink;
  session?: Session | null;
};

export function LinkCard({ link, session }: LinkCardProps) {
  const { clicks, url, slug } = link;
  const decodedURL = decodeURIComponent(url);
  const shortenedURL = `${getBaseUrl()}/${slug}`;

  return (
    <Card className="relative transition-colors hover:border-foreground dark:hover:border-neutral-500">
      <CardContent className="flex gap-2 p-3">
        {/* REVIEW: image... */}
        <div className="flex min-w-8 flex-col justify-center">
          <Image
            src={"vercel.svg"}
            alt="icon"
            className="rounded-full"
            width={32}
            height={32}
            quality={100}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2 pe-9">
            <a
              href={shortenedURL}
              // REVIEW: css width를 어떻게 지정했지?
              className="w-[168px] truncate font-mono font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              {shortenedURL.split("://")[1]}
            </a>

            <div className="flex items-center gap-2">
              <LinkCopyButton textToCopy={shortenedURL} />

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex cursor-pointer items-center gap-1 font-mono">
                    <Icons.Eye
                      className={iconVariants({ size: "sm" })}
                      aria-label="Total clicks"
                    />
                    <span className="text-xs">
                      {formatNumber(clicks, { notation: "compact" })}
                    </span>
                  </div>
                </TooltipTrigger>

                <TooltipContent>
                  <p>
                    {formatNumber(clicks, { notation: "standard" })} Total
                    clicks
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          <div className="flex w-full max-w-52 flex-col gap-2 text-xs text-muted-foreground sm:max-w-72">
            <a
              href={decodedURL}
              className="truncate"
              target="_blank"
              rel="noopener noreferrer"
            >
              {decodedURL}
            </a>
            {link.description && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="line-clamp-1">{link.description}</p>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{link.description}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </CardContent>

      <LinkOptionsDropdownProps
        link={{ ...link, url: decodedURL }}
        session={session}
      />

      {slug !== "github" && (
        <span className="absolute bottom-3 right-3 text-[10px] font-medium text-muted-foreground">
          <Tooltip>
            <TooltipTrigger>
              {/* REVIEW: */}
              {formatDistanceToNowStrict(new Date(link.createdAt), {
                addSuffix: true,
              })}
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {/* REVIEW: */}
                {new Intl.DateTimeFormat("en-US", {
                  dateStyle: "long",
                  timeStyle: "short",
                }).format(new Date(link.createdAt))}
              </p>
            </TooltipContent>
          </Tooltip>
        </span>
      )}
    </Card>
  );
}
