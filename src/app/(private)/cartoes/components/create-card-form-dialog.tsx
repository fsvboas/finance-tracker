"use client";

import CardTypeSelectInput from "@/src/app/(private)/cartoes/components/card-type-select-input";
import { postCard } from "@/src/app/(private)/cartoes/services";
import { Button } from "@/src/components/button";
import DatePicker from "@/src/components/date-picker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/dialog";
import { Input } from "@/src/components/input";
import { Label } from "@/src/components/label";
import Column from "@/src/components/utils/column";
import Flex from "@/src/components/utils/flex";
import Show from "@/src/components/utils/show";
import { currencyFormatter } from "@/src/helpers/currency-formatter";
import { queryClient } from "@/src/libs/tanstack-query/query-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

interface CreateCardFormDialogProps {
  trigger: React.ReactNode;
}

export const cardFormSchema = z.object({
  cardName: z.string().min(1, "O nome do cartão é obrigatório"),
  cardType: z.enum(["credit", "debit"]),
  cardLimit: z
    .number()
    .min(0, "O limite do cartão deve ser maior ou igual a 0"),
  cardDueDate: z.date(),
  cardColor: z.string().optional(),
});

export type CardFormSchemaType = z.infer<typeof cardFormSchema>;

const CreateCardFormDialog = ({ trigger }: CreateCardFormDialogProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { control, handleSubmit, reset } = useForm<CardFormSchemaType>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: {
      cardName: "",
      cardType: "debit",
      cardLimit: 0,
      cardDueDate: new Date(),
      cardColor: "",
    },
  });

  const { mutate: post, isPending: pendingPostCard } = useMutation({
    mutationFn: postCard,
    onSuccess: async () => {
      await queryClient?.invalidateQueries({ queryKey: ["cards"] });
      toast.success("Cartão criado com sucesso!", {
        className: "!bg-green-600/80 !text-white",
      });

      setIsOpen(false);
      reset();
    },
    onError: (error) => {
      toast.error(error.message, {
        className: "!bg-red-600/80 !text-white",
      });
    },
  });

  const handleCreateNewCard = (card: CardFormSchemaType) => {
    post({ card });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <form
          id="card-form"
          onSubmit={handleSubmit(handleCreateNewCard)}
          className="space-y-4 my-4"
        >
          <DialogHeader>
            <DialogTitle>Criar novo cartão</DialogTitle>
          </DialogHeader>
          <Column className="grid grid-cols-8 gap-4">
            <Column className="space-y-2 w-full col-span-4">
              <Label htmlFor="cardName">
                Nome do cartão<span className="text-red-500">*</span>
              </Label>
              <Controller
                name="cardName"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <Column>
                    <Input
                      id="cardName"
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
              <Label htmlFor="cardType">
                Tipo de cartão<span className="text-red-500">*</span>
              </Label>
              <Controller
                name="cardType"
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
              <Label htmlFor="cardLimit">
                Limite do cartão<span className="text-red-500">*</span>
              </Label>
              <Controller
                name="cardLimit"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <Column>
                    <Input
                      id="cardLimit"
                      inputMode="numeric"
                      placeholder="R$ 2.000,00"
                      value={currencyFormatter(Number(value))}
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/\D/g, "");
                        onChange(Number(rawValue));
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
              <Label htmlFor="cardDueDate">
                Vencimento<span className="text-red-500">*</span>
              </Label>
              <Controller
                name="cardDueDate"
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
          <Flex className="justify-end space-x-2 mt-6">
            <Button
              className="hover:cursor-pointer"
              variant="secondary"
              type="button"
              onClick={() => setIsOpen(false)}
              disabled={pendingPostCard}
            >
              Cancelar
            </Button>
            <Button
              className="hover:cursor-pointer"
              type="submit"
              disabled={pendingPostCard}
            >
              Adicionar
            </Button>
          </Flex>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCardFormDialog;
