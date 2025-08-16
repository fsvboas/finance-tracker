"use client";

import { useUserSecrets } from "@/src/contexts/user-secrets-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import {
  createUserPin,
  validateUserPin,
} from "../app/dashboard/services/user-pin";
import { queryClient } from "../libs/tanstack-query";
import { Button } from "./button";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "./dialog";
import { Input } from "./input";
import Column from "./utils/column";
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

  // CHANGE "APAGAR" AND "APAGAR TUDO" TO ICONS
  const buttons = [
    "7",
    "8",
    "9",
    "4",
    "5",
    "6",
    "1",
    "2",
    "3",
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
          <DialogTitle className="text-center">
            {mode === "create" ? "Crie seu PIN" : "Digite seu PIN"}
          </DialogTitle>
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
                    {buttons.map((button, index) => (
                      <Button
                        key={index}
                        type="button"
                        className="cursor-pointer bg-neutral-200 text-black hover:bg-neutral-300"
                        onClick={() =>
                          handleButtonClick(button, value, onChange)
                        }
                        disabled={
                          (button === "Apagar" || button === "Limpar") &&
                          value.length === 0
                        }
                      >
                        {button}
                      </Button>
                    ))}
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
