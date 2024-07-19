import * as React from "react";
import Image from "next/image";
import { Heading } from "@/components/ui/heading";
import { Loader } from "@/components/ui/loader";
import { LinkForm } from "@/components/links/link-form";
import { CustomLinkButton } from "@/components/links/custom-link-button";
import { CustomLink } from "@/components/links/custom-link";
import { LinkList } from "@/components/links/link-list";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <div className="my-10 space-y-2 text-center">
        <Heading variant={"h1"} isFirstBlock className="text-3xl sm:text-4xl">
          Free URL shortener
        </Heading>
        <Heading
          className="text-xl text-muted-foreground sm:text-2xl"
          variant={"h2"}
        >
          open source free URL shortener
        </Heading>
      </div>

      <div className="flex w-full flex-col items-center gap-4">
        <LinkForm
          renderCustomLink={
            <React.Suspense fallback={<CustomLinkButton disabled />}>
              <CustomLink />
            </React.Suspense>
          }
        />

        <React.Suspense fallback={<Loader size="4xl" className="my-20" />}>
          <LinkList />
        </React.Suspense>
      </div>
    </div>
  );
}
