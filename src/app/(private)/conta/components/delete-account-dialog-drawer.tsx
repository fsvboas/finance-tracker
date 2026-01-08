"use client";

import { Button } from "@/src/components/core/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/core/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/src/components/core/drawer";
import { useMediaQuery } from "@/src/hooks/use-media-query";
import { useState } from "react";
import DeleteAccountForm from "./delete-account-form";

interface DeleteAccountDialogDrawerProps {
  trigger: React.ReactNode;
}

const DeleteAccountDialogDrawer = ({
  trigger,
}: DeleteAccountDialogDrawerProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [open, setOpen] = useState<boolean>(false);

  if (isDesktop) {
    return (
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
        }}
      >
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader className="overflow-hidden border-b-1 border-black/10">
            <DialogTitle className="overflow-hidden text-ellipsis pb-2">
              Excluir Conta
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Ao excluir sua conta na plataforma Finance Tracker, todos os seus
            dados serão removidos do nosso sistema.
            {/* Recomendamos que faça o
            backup de seus dados antes da exclusão, utilizando o botão
            &quot;Baixar Planilha&quot;. */}
          </DialogDescription>
          <DeleteAccountForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className="p-4">
        <DrawerHeader className="space-y-2 p-4">
          <DrawerTitle>Excluir Conta</DrawerTitle>
          <DrawerDescription>
            Ao excluir sua conta na plataforma Finance Tracker, todos os seus
            dados serão removidos do nosso sistema.
          </DrawerDescription>
        </DrawerHeader>
        <DeleteAccountForm />
        <DrawerFooter className="w-full mt-2">
          <DrawerClose asChild className="w-full">
            <Button variant="outline" className="w-full">
              Cancelar
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default DeleteAccountDialogDrawer;
