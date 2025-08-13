"use client";

import { usePin } from "@/src/contexts/user-pin-context";
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
import { Dialog, DialogContent } from "./dialog";
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

export function UserPinFormDialog({ userId, mode }: UserPinFormDialogProps) {
  const { pin, setPin } = usePin();
  const [isOpen, setIsOpen] = useState<boolean>(!pin);

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
    } else if (value === "Apagar Tudo") {
      onChange("");
    } else if (currentValue.length < 4 && !isNaN(Number(value))) {
      const newValue = currentValue + value;
      onChange(newValue);
    }
  };

  const submitButtonLabel = mode === "create" ? "Criar PIN" : "Validar PIN";

  const { mutate: create, isPending: pendingCreateUserPin } = useMutation({
    mutationFn: createUserPin,
    onSuccess: (_, variables) => {
      setPin(variables.pin);
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
    onSuccess: (_, variables) => {
      setPin(variables.pin);
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-full !max-w-xs">
        <DialogTitle>
          {mode === "create" ? "Crie seu PIN" : "Digite seu PIN"}
        </DialogTitle>
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
                        className="cursor-pointer"
                        onClick={() =>
                          handleButtonClick(button, value, onChange)
                        }
                        disabled={
                          (button === "Apagar" || button === "Apagar Tudo") &&
                          value.length === 0
                        }
                      >
                        {button}
                      </Button>
                    ))}
                  </div>
                  <Button
                    type="submit"
                    className="cursor-pointer bg-green-600 hover:bg-green-500"
                    disabled={
                      value.length !== 4 ||
                      pendingCreateUserPin ||
                      pendingValidateUserPin
                    }
                  >
                    <Show when={pendingCreateUserPin || pendingValidateUserPin}>
                      <Loader2Icon className="animate-spin" />
                    </Show>
                    {submitButtonLabel}
                  </Button>
                </>
              )}
            />
          </Column>
        </form>
      </DialogContent>
    </Dialog>
  );
}
