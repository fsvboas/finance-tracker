"use client";

import { Button } from "@/src/components/core/button";
import Column from "@/src/components/core/column";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/core/dialog";
import Flex from "@/src/components/core/flex";
import Show from "@/src/components/core/show";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Loader2Icon, X } from "lucide-react";
import { useState } from "react";

interface ConfirmDeleteDialogProps {
  trigger: React.ReactNode;
  title?: string;
  itemName?: string;
  description?: string;
  isPending?: boolean;
  onConfirm: () => void;
}

const ConfirmDeleteDialog = ({
  trigger,
  title = "Excluir Item",
  itemName,
  description = "Você tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.",
  isPending = false,
  onConfirm,
}: ConfirmDeleteDialogProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleConfirm = () => {
    onConfirm();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="flex flex-col items-center"
      >
        <DialogHeader className="items-center gap-4">
          <Flex className="w-12 h-12 rounded-full bg-red-200 items-center justify-center border border-red-600 shrink-0 shadow-md">
            <X className="text-red-600" />
          </Flex>
          <Column className="items-center gap-2">
            <DialogTitle>{title}</DialogTitle>
            {itemName && (
              <span className="text-xs text-muted-foreground text-center truncate max-w-xs">
                {itemName}
              </span>
            )}
          </Column>
        </DialogHeader>
        <DialogDescription className="text-center text-base">
          {description}
        </DialogDescription>
        <DialogFooter className="w-full items-center">
          <Button
            variant="outline"
            className="flex-1 w-full"
            onClick={() => setIsOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            className="flex-1 w-full"
            onClick={handleConfirm}
            disabled={isPending}
          >
            <Show when={isPending}>
              <Loader2Icon className="animate-spin" />
            </Show>
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
