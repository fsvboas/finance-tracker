"use client";

import { useUserSecrets } from "@/src/providers/user-secrets-provider";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Info } from "lucide-react";
import { useState } from "react";
import { useMediaQuery } from "../hooks/use-media-query";
import { Button } from "./button";
import { Dialog, DialogContent, DialogHeader } from "./dialog";
import { Drawer, DrawerContent, DrawerHeader } from "./drawer";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import UserPinForm from "./user-pin-form";
import Row from "./utils/row";

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
  const [openTooltip, setOpenTooltip] = useState<boolean>(false);

  const handleOpenChange = (open: boolean) => {
    if (!open && !credentials?.pin) return;
    setIsOpen(open);
  };

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange} modal>
        <DialogContent showCloseButton={false} className="w-full !max-w-xs">
          <DialogHeader>
            <UserPinFormDialogDrawerContent
              userId={userId}
              mode={mode}
              setIsOpen={setIsOpen}
              openTooltip={openTooltip}
              setOpenTooltip={setOpenTooltip}
            />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange} dismissible={false}>
      <DrawerContent className="p-4">
        <DrawerHeader className="space-y-2 py-4">
          <UserPinFormDialogDrawerContent
            userId={userId}
            mode={mode}
            setIsOpen={setIsOpen}
            openTooltip={openTooltip}
            setOpenTooltip={setOpenTooltip}
          />
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
};

export default UserPinFormDialogDrawer;

interface UserPinFormDialogDrawerContentProps {
  userId: string;
  mode: "create" | "validate";
  setIsOpen: (open: boolean) => void;
  openTooltip: boolean;
  setOpenTooltip: (open: boolean) => void;
}

const UserPinFormDialogDrawerContent = ({
  userId,
  mode,
  setIsOpen,
  openTooltip,
  setOpenTooltip,
}: UserPinFormDialogDrawerContentProps) => (
  <>
    <Row className="items-center space-x-2">
      <DialogTitle className="text-center">
        {mode === "create" ? "Crie seu PIN" : "Digite seu PIN"}
      </DialogTitle>
      <Tooltip open={openTooltip} onOpenChange={setOpenTooltip}>
        <TooltipTrigger asChild>
          <Button
            type="button"
            className="bg-transparent shadow-none text-primary hover:bg-transparent !p-0 h-fit"
            onClick={() => setOpenTooltip(!openTooltip)}
            onMouseEnter={() => setOpenTooltip(true)}
            onMouseLeave={() => setOpenTooltip(false)}
            onTouchStart={() => setOpenTooltip(!openTooltip)}
            onKeyDown={(event) => {
              event.preventDefault();
              // eslint-disable-next-line @typescript-eslint/no-unused-expressions
              event.key === "Enter" && setOpenTooltip(!openTooltip);
            }}
          >
            <Info size={16} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            O PIN garante que suas transações sejam <br /> protegidas por
            criptografia.
          </p>
        </TooltipContent>
      </Tooltip>
    </Row>
    <UserPinForm userId={userId} mode={mode} setIsOpen={setIsOpen} />
  </>
);
