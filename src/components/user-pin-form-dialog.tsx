"use client";

import { queryClient } from "@/src/libs/tanstack-query/query-client";
import { useUserSecrets } from "@/src/providers/user-secrets-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useMutation } from "@tanstack/react-query";
import { BrushCleaning, Delete, Info, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import {
  createUserPin,
  validateUserPin,
} from "../app/dashboard/services/user-pin";
import { Button } from "./button";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "./dialog";
import { Input } from "./input";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import Column from "./utils/column";
import Row from "./utils/row";
import Show from "./utils/show";

const PinFormSchema = z.object({
  pin: z.string().length(4, "PIN deve ter exatamente 4 caracteres"),
});

type PinFormSchemaType = z.infer<typeof PinFormSchema>;

interface UserPinFormDialogProps {
  userId: string;
  mode: "create" | "validate";
}

const UserPinFormDialog = ({ userId, mode }: UserPinFormDialogProps) => {
  const { credentials, setCredentials } = useUserSecrets();
  const [isOpen, setIsOpen] = useState<boolean>(!credentials?.pin);

  const { handleSubmit, control } = useForm<PinFormSchemaType>({
    resolver: zodResolver(PinFormSchema),
    defaultValues: { pin: "" },
  });

  const buttons = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "Limpar",
    "0",
    "Apagar",
  ];

  const handleButtonClick = (
    value: string,
    currentValue: string,
    onChange: (value: string) => void
  ) => {
    if (value === "Apagar") {
      const newValue = currentValue.slice(0, -1);
      onChange(newValue);
    } else if (value === "Limpar") {
      onChange("");
    } else if (currentValue.length < 4 && !isNaN(Number(value))) {
      const newValue = currentValue + value;
      onChange(newValue);
    }
  };

  const submitButtonLabel = mode === "create" ? "Criar PIN" : "Validar PIN";

  const { mutate: create, isPending: pendingCreateUserPin } = useMutation({
    mutationFn: createUserPin,
    onSuccess: (data, variables) => {
      setCredentials({ pin: variables.pin, salt: data });
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error(error.message, {
        className: "!bg-red-600/80 !text-white",
      });
    },
  });

  const { mutate: validate, isPending: pendingValidateUserPin } = useMutation({
    mutationFn: validateUserPin,
    onSuccess: async (_, variables) => {
      const salt = await validateUserPin({
        userId: variables.userId,
        pin: variables.pin,
      });
      setCredentials({ pin: variables.pin, salt: salt });
      queryClient?.invalidateQueries({ queryKey: ["transactions"] });
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error(error.message, {
        className: "!bg-red-600/80 !text-white",
      });
    },
  });

  const onSubmit = async (data: PinFormSchemaType) => {
    if (mode === "create") return create({ userId, pin: data.pin });
    validate({ userId, pin: data.pin });
  };

  const pending = pendingCreateUserPin || pendingValidateUserPin;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !credentials?.pin) return;
        setIsOpen(open);
      }}
      modal
    >
      <DialogContent showCloseButton={false} className="w-full !max-w-xs">
        <DialogHeader>
          <Row className="items-center justify-between">
            <DialogTitle className="text-center">
              {mode === "create" ? "Crie seu PIN" : "Digite seu PIN"}
            </DialogTitle>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info size={20} />
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  O PIN garante que suas transações sejam protegidas por
                  criptografia.
                </p>
              </TooltipContent>
            </Tooltip>
          </Row>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Column className="space-y-2">
            <Controller
              name="pin"
              control={control}
              render={({ field: { value, onChange } }) => (
                <>
                  <Input
                    readOnly
                    value={value}
                    placeholder="****"
                    type="password"
                    className="text-center tracking-widest"
                  />
                  <div className="grid grid-cols-3 gap-1">
                    {buttons.map((button, index) => {
                      const buttonLabel =
                        button === "Apagar" ? (
                          <Delete />
                        ) : button === "Limpar" ? (
                          <BrushCleaning />
                        ) : (
                          button
                        );
                      return (
                        <Button
                          key={index}
                          type="button"
                          className="cursor-pointer bg-neutral-200 dark:bg-[#202020] text-black dark:text-white hover:bg-neutral-300 dark:hover:bg-[#101010]"
                          onClick={() =>
                            handleButtonClick(button, value, onChange)
                          }
                          disabled={
                            (button === "Apagar" || button === "Limpar") &&
                            value.length === 0
                          }
                        >
                          {buttonLabel}
                        </Button>
                      );
                    })}
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      className="cursor-pointer bg-green-500 hover:bg-green-400 w-full"
                      disabled={value.length !== 4 || pending}
                    >
                      <Show when={pending}>
                        <Loader2Icon className="animate-spin" />
                      </Show>
                      {submitButtonLabel}
                    </Button>
                  </DialogFooter>
                </>
              )}
            />
          </Column>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserPinFormDialog;
