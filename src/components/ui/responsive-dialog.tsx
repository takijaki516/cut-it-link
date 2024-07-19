import * as React from "react";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";

type ResponsiveDialogContextType = {
  isDesktop: boolean;
};

const ResponsiveDialogContext = React.createContext<
  ResponsiveDialogContextType | undefined
>(undefined);

function useResponsiveDialog() {
  const context = React.useContext(ResponsiveDialogContext);
  if (!context) {
    throw new Error(
      "useResponsiveDialog must be used within a ResponsiveDialogProvider",
    );
  }
  return context;
}

interface ResponsiveDialogProps {
  children?: React.ReactNode;
  onOpenChange?: (isOpen: boolean) => void;
  open?: boolean;
}

function ResponsiveDialog(props: ResponsiveDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px");

  const Comp = isDesktop ? Dialog : Drawer;

  return (
    <ResponsiveDialogContext.Provider value={{ isDesktop }}>
      <Comp {...props} />
    </ResponsiveDialogContext.Provider>
  );
}

interface BaseProps {
  children?: React.ReactNode;
  className?: React.ComponentProps<"div">["className"];
  asChild?: boolean;
}

function ResponsiveDialogTrigger(props: BaseProps) {
  const { isDesktop } = useResponsiveDialog();
  const Comp = isDesktop ? DialogTrigger : DrawerTrigger;

  return <Comp {...props} />;
}

function ResponsiveDialogContent({ className, ...props }: BaseProps) {
  const { isDesktop } = useResponsiveDialog();
  const Comp = isDesktop ? DialogContent : DrawerContent;

  return (
    <Comp
      // REVIEW: css
      className={cn({ "sm:max-w-[425px]": isDesktop }, className)}
      {...props}
    />
  );
}

function ResponsiveDialogBody({ className, ...props }: BaseProps) {
  const { isDesktop } = useResponsiveDialog();

  return (
    <div className={cn({ "px-4 pt-4": !isDesktop }, className)} {...props} />
  );
}

function ResponsiveDialogHeader({ className, ...props }: BaseProps) {
  const { isDesktop } = useResponsiveDialog();
  const Comp = isDesktop ? DialogHeader : DrawerHeader;
  return (
    <Comp className={cn({ "text-left": !isDesktop }, className)} {...props} />
  );
}

function ResponsiveDialogTitle(props: BaseProps) {
  const { isDesktop } = useResponsiveDialog();
  const Comp = isDesktop ? DialogTitle : DrawerTitle;

  return <Comp {...props} />;
}

function ResponsiveDialogFooter({ className, ...props }: BaseProps) {
  const { isDesktop } = useResponsiveDialog();

  return (
    !isDesktop && (
      <DrawerFooter
        // REVIEW: css굳이 옵션을 줄 필요가?
        className={cn({ "pt-2": !isDesktop }, className)}
        {...props}
      />
    )
  );
}

function ResponsiveDialogClose(props: BaseProps) {
  const { isDesktop } = useResponsiveDialog();

  return !isDesktop && <DrawerClose {...props} />;
}

export {
  ResponsiveDialog,
  ResponsiveDialogTrigger,
  ResponsiveDialogContent,
  ResponsiveDialogBody,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogFooter,
  ResponsiveDialogClose,
};
