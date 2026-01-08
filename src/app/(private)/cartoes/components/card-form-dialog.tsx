"use client";

import CardTypeSelectInput from "@/src/app/(private)/cartoes/components/card-type-select-input";
import { postCard } from "@/src/app/(private)/cartoes/services";
import { updateCard } from "@/src/app/(private)/cartoes/services/update-card";
import { CardType } from "@/src/app/(private)/cartoes/types/card-type";
import { Button } from "@/src/components/core/button";
import Column from "@/src/components/core/column";
import DatePicker from "@/src/components/core/date-picker";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/core/dialog";
import { Input } from "@/src/components/core/input";
import { Label } from "@/src/components/core/label";
import Show from "@/src/components/core/show";
import { currencyFormatter } from "@/src/helpers/currency-formatter";
import { queryClient } from "@/src/libs/tanstack-query/query-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon, PlusIcon, SaveIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

interface CardFormDialogProps {
  trigger: React.ReactNode;
  mode?: "create" | "update";
  card?: CardType;
}

export const cardFormSchema = z.object({
  name: z.string().min(1, "O nome do cartão é obrigatório"),
  type: z.enum(["credit", "debit"]),
  creditLimit: z
    .string()
    .min(1, { message: "Campo obrigatório." })
    .refine((value) => Number(value) > 0, { message: "Campo obrigatório." }),
  dueDate: z.date(),
  color: z.string().optional(),
});

export type CardFormSchemaType = z.infer<typeof cardFormSchema>;

const CardFormDialog = ({
  trigger,
  mode = "create",
  card,
}: CardFormDialogProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const isUpdateMode = mode === "update";

  const { control, handleSubmit, reset } = useForm<CardFormSchemaType>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: {
      name: card?.name || "",
      type: card?.type || ("debit" as const),
      creditLimit: card?.creditLimit || "",
      dueDate: card?.dueDate ? new Date(card?.dueDate) : new Date(),
      color: card?.color || "",
    },
  });

  const { mutate: post, isPending: pendingPostCard } = useMutation({
    mutationFn: postCard,
    onSuccess: async (_, variables) => {
      await queryClient?.invalidateQueries({ queryKey: ["cards"] });
      toast.success(`Cartão "${variables.card.name}" criado com sucesso!`, {
        className: "!bg-green-600/80 !text-white",
      });

      setIsOpen(false);
    },
    onError: (error) => {
      toast.error(error.message, {
        className: "!bg-red-600/80 !text-white",
      });
    },
  });

  const { mutate: update, isPending: pendingUpdateCard } = useMutation({
    mutationFn: updateCard,
    onSuccess: async () => {
      await queryClient?.invalidateQueries({ queryKey: ["cards"] });
      toast.success(`Cartão editado com sucesso!`, {
        className: "!bg-green-600/80 !text-white",
      });
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error(error.message, {
        className: "!bg-red-600/80 !text-white",
      });
    },
  });

  const handleSubmitForm = (formData: CardFormSchemaType) => {
    const payload: CardType = {
      id: card?.id || crypto.randomUUID(),
      ...formData,
    };

    if (isUpdateMode) {
      return update({ card: payload });
    }

    post({ card: payload });
  };

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, reset, card]);

  const isPending = pendingPostCard || pendingUpdateCard;

  const dialogTitle = isUpdateMode ? "Editar Cartão" : "Criar novo cartão";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <form
          id="card-form"
          onSubmit={handleSubmit(handleSubmitForm)}
          className="my-4"
        >
          <DialogHeader className="mb-4">
            <DialogTitle>{dialogTitle}</DialogTitle>
          </DialogHeader>
          <Column className="grid grid-cols-8 gap-4">
            <Column className="space-y-2 w-full col-span-4">
              <Label htmlFor="name">
                Nome do cartão<span className="text-red-500">*</span>
              </Label>
              <Controller
                name="name"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <Column>
                    <Input
                      id="name"
                      placeholder="Nubank"
                      value={value}
                      onChange={onChange}
                      className={`${error ? "border-red-600" : ""}`}
                    />
                    <div className="h-2 -mt-1">
                      <Show when={error}>
                        <span className="text-xs text-red-600">
                          {error?.message}
                        </span>
                      </Show>
                    </div>
                  </Column>
                )}
              />
            </Column>
            <Column className="space-y-2 w-full col-span-4">
              <Label htmlFor="type">
                Tipo de cartão<span className="text-red-500">*</span>
              </Label>
              <Controller
                name="type"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Column className="w-full">
                    <CardTypeSelectInput
                      value={value ?? ""}
                      onChange={onChange}
                    />
                    <div className="h-2 -mt-1" />
                  </Column>
                )}
              />
            </Column>
            <Column className="space-y-2 w-full col-span-3">
              <Label htmlFor="creditLimit">
                Limite do cartão<span className="text-red-500">*</span>
              </Label>
              <Controller
                name="creditLimit"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <Column>
                    <Input
                      id="creditLimit"
                      inputMode="numeric"
                      placeholder="R$ 2.000,00"
                      value={currencyFormatter(Number(value))}
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/\D/g, "");
                        onChange(rawValue);
                      }}
                      className={`${error ? "border-red-600" : ""}`}
                    />
                    <div className="h-2 -mt-1">
                      <Show when={error}>
                        <span className="text-xs text-red-600">
                          {error?.message}
                        </span>
                      </Show>
                    </div>
                  </Column>
                )}
              />
            </Column>
            <Column className="space-y-2 w-full col-span-3">
              <Label htmlFor="dueDate">
                Vencimento<span className="text-red-500">*</span>
              </Label>
              <Controller
                name="dueDate"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Column className="w-full">
                    <DatePicker
                      value={value}
                      onValueChange={(date) => onChange(date)}
                    />
                    <div className="h-2 -mt-1" />
                  </Column>
                )}
              />
            </Column>
          </Column>
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button
                className="hover:cursor-pointer"
                variant="secondary"
                disabled={isPending}
              >
                <XIcon />
                Cancelar
              </Button>
            </DialogClose>
            <Button
              className="hover:cursor-pointer"
              type="submit"
              disabled={isPending}
            >
              <Show
                when={isPending}
                fallback={isUpdateMode ? <SaveIcon /> : <PlusIcon />}
              >
                <Loader2Icon className="animate-spin" />
              </Show>
              {isUpdateMode ? "Salvar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CardFormDialog;
