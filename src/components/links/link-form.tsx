"use client";

import * as React from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";

import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Icons, iconVariants } from "../ui/icons";
import { createShortLink } from "@/lib/actions/link";
import { setFormErrors } from "@/lib/utils";

const formSchema = z.object({
  url: z.string().url(),
});

type FormSchema = z.infer<typeof formSchema>;

interface LinkFormProps {
  renderCustomLink: React.ReactNode;
}

export function LinkForm({ renderCustomLink }: LinkFormProps) {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  const { execute: createLink, status: createLinkStatus } = useAction(
    createShortLink,
    {
      onSuccess() {
        toast.success("Link created successfully");
        form.reset();
      },
      onError({ error }) {
        if (error.validationErrors) {
          // REVIEW:
          return setFormErrors(form as any, error.validationErrors);
        }
        toast.error(error.serverError ?? error.fetchError);
      },
    },
  );

  function onSubmit(data: FormSchema) {
    createLink({ url: data.url, slug: "" });
  }

  return (
    <Form {...form}>
      <div className="flex w-full gap-2">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full justify-center gap-2"
        >
          <div className="flex-1">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Enter the link here" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* REVIEW: */}
          <Button size="icon" isLoading={createLinkStatus === "executing"}>
            <Icons.Scissors className={iconVariants({ size: "lg" })} />
            <span className="sr-only">Create short link</span>
          </Button>
        </form>

        {renderCustomLink}
      </div>
    </Form>
  );
}
