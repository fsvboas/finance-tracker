"use client";

import { useUserSecrets } from "@/src/providers/user-secrets-provider";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useState } from "react";
import { useMediaQuery } from "../hooks/use-media-query";
import { Dialog, DialogContent, DialogHeader } from "./dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "./drawer";
import UserPinForm from "./user-pin-form";
import UserPinFormDialogDrawerTooltip from "./user-pin-form-dialog-drawer-tooltip";

interface UserPinFormDialogDrawerProps {
  userId: string;
  mode: "create" | "validate";
}

const UserPinFormDialogDrawer = ({
  userId,
  mode,
}: UserPinFormDialogDrawerProps) => {
  const { credentials } = useUserSecrets();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [isOpen, setIsOpen] = useState<boolean>(!credentials?.pin);

  const handleOpenChange = (open: boolean) => {
    if (!open && !credentials?.pin) return;
    setIsOpen(open);
  };

  const dialogDrawerTitle =
    mode === "create" ? "Crie seu PIN" : "Digite seu PIN";

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange} modal>
        <DialogContent showCloseButton={false} className="w-full !max-w-xs">
          <DialogHeader className="flex flex-row items-center">
            <DialogTitle>{dialogDrawerTitle}</DialogTitle>
            <UserPinFormDialogDrawerTooltip />
          </DialogHeader>
          <UserPinForm userId={userId} mode={mode} setIsOpen={setIsOpen} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange} dismissible={false}>
      <DrawerContent className="p-4">
        <DrawerHeader className="flex flex-row items-center space-x-2 py-4">
          <DrawerTitle>{dialogDrawerTitle}</DrawerTitle>
          <UserPinFormDialogDrawerTooltip />
        </DrawerHeader>
        <UserPinForm userId={userId} mode={mode} setIsOpen={setIsOpen} />
      </DrawerContent>
    </Drawer>
  );
};

export default UserPinFormDialogDrawer;
