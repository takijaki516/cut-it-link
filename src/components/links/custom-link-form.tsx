import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";

import { nanoid, setFormErrors } from "@/lib/utils";
import { Button } from "../ui/button";
import { insertLinkSchema } from "@/lib/validation/link";
import { ShortLink } from "@/lib/db/schema";
import { useDebounce } from "@/hooks/use-debounce";
import { SafeActionError } from "@/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { checkSlug, createShortLink, editShortLink } from "@/lib/actions/link";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Icons, iconVariants } from "../ui/icons";
import { Loader } from "../ui/loader";

const formSchema = insertLinkSchema;

type FormSchema = z.infer<typeof formSchema>;

type CustomLinkFormProps = (
  | { isEditing: boolean; defaultValues?: ShortLink }
  | { isEditing?: undefined; defaultValues?: undefined }
) & {
  onSetIsDialogOpen: (value: boolean) => void;
};

export function CustomLinkForm({
  onSetIsDialogOpen,
  defaultValues,
  isEditing,
}: CustomLinkFormProps) {
  const [isSlugExist, setIsSlugExist] = React.useState(false);
  //
  const [slug, setSlug] = React.useState("");
  const debouncedSlug = useDebounce(slug, 500);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: defaultValues?.url ?? "",
      slug: defaultValues?.slug ?? "",
      description: defaultValues?.description ?? "",
    },
  });

  const handleSuccess = () => {
    toast.success("");
    onSetIsDialogOpen(false);
    form.reset();
  };

  const handleError = ({ error }: { error: SafeActionError }) => {
    if (error.validationError) {
      return setFormErrors(form, error.validationError);
    }
    toast.error(error.serverError ?? error.fetchError);
  };

  const { execute: createLink, status: createLinkStatus } = useAction(
    createShortLink,
    {
      onSuccess: handleSuccess,
      onError: handleError,
    },
  );

  const { execute: editLink, status: editLinkStatus } = useAction(
    editShortLink,
    {
      onSuccess: handleSuccess,
      onError: handleError,
    },
  );

  const { execute: checkSlugExists, status: checkSlugExistsStatus } = useAction(
    checkSlug,
    {
      onError: handleError,
      onSuccess: (slugExist) => {
        if (slugExist) {
          setIsSlugExist(true);
          form.setError("slug", { message: "Slug alreday exist" });
        } else {
          setIsSlugExist(false);
          form.clearErrors("slug");
        }
      },
    },
  );

  React.useEffect(() => {
    setIsSlugExist(false);

    // REVIEW:
    if (!debouncedSlug) {
      return form.clearErrors("slug");
    }

    checkSlugExists({ slug: debouncedSlug });
  }, [debouncedSlug, form, checkSlugExists]);

  const onSubmit = (data: FormSchema) => {
    if (isSlugExist) {
      return form.setError("slug", { message: "Slug already exist" });
    }

    if (isEditing) {
      editLink({ slug: defaultValues?.slug ?? "", newLink: data });
    } else {
      createLink(data);
    }
  };

  const isExecuting =
    createLinkStatus === "executing" || editLinkStatus === "executing";
  const isCheckingSlug = checkSlugExistsStatus === "executing";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Destination URL</FormLabel>
              <FormControl>
                <Input placeholder="https://github.com/" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex w-full items-center justify-between">
                <div>Short Link (optional)</div>

                <Button
                  // REVIEW: h-auto???   px-0 py-0?
                  className="flex h-auto items-center px-0 py-0 text-xs text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                  type="button"
                  variant={"ghost"}
                  onClick={() => {
                    const newSlug = nanoid();
                    form.setValue("slug", newSlug);
                    setSlug(newSlug);
                  }}
                >
                  <Icons.Shuffle
                    className={iconVariants({
                      size: "xs",
                      className: "mr-1",
                    })}
                  />
                  Randomize
                </Button>
              </FormLabel>

              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder="github"
                    className="pe-8"
                    onChange={(e) => {
                      field.onChange(e);
                      setSlug(e.target.value);
                    }}
                  />
                  {isCheckingSlug && (
                    // REVIEW: css transform?
                    <div className="absolute end-3 top-1/2 -translate-y-1/2 transform text-muted-foreground">
                      <Loader />
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Your description here"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={!form.formState.isDirty}
          isLoading={isExecuting}
        >
          {isEditing
            ? isExecuting
              ? "Saving Changes...."
              : "Save Changes"
            : isExecuting
              ? "Creating link...."
              : "Create link"}
        </Button>
      </form>
    </Form>
  );
}
