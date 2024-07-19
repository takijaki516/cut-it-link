import { auth } from "@/auth";

import { CustomLinkButton } from "./custom-link-button";
import { CustomLinkDialog } from "./custom-link-dialog";

export async function CustomLink() {
  const session = await auth();

  if (!session) {
    return <CustomLinkButton disabled />;
  }

  return <CustomLinkDialog />;
}
