"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { queryClient } from "../libs/tanstack-query";
import { postTransaction } from "../services/post-transaction";
import { TransactionType } from "../types/transaction-type";
import { Button } from "./ui/button";
import DatePicker from "./ui/date-picker";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import Column from "./utils/column";
import Flex from "./utils/flex";
import Show from "./utils/show";

interface AddTransactionFormDialogProps {
  trigger: React.ReactNode;
}

const schema = z.object({
  transactionType: z.enum(["incoming", "outcoming"]),
  description: z
    .string()
    .min(1, { message: "Adicione uma descrição para a transação." }),
  value: z.string().min(1, { message: "Adicione o valor da transação." }),
  date: z.date(),
});

type TransactionFormSchemaType = z.infer<typeof schema>;

const AddTransactionFormDialog = ({
  trigger,
}: AddTransactionFormDialogProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { control, handleSubmit } = useForm<TransactionFormSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      transactionType: "incoming",
      description: "",
      value: "",
      date: new Date(),
    },
  });

  const { mutate: post, isPending: pendingPostTransaction } = useMutation({
    mutationFn: postTransaction,
    onSuccess: () => {
      queryClient?.invalidateQueries({ queryKey: ["transactions"] });
      setIsOpen(false);
    },
    onError: (error) => {
      // TO-DO: TOAST
      console.log(error);
    },
  });

  const handleAddTransaction = (transaction: TransactionFormSchemaType) => {
    const payload: TransactionType = {
      id: crypto.randomUUID(),
      ...transaction,
    };
    post({ transaction: payload });
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <form
          id="transaction-form"
          onSubmit={handleSubmit(handleAddTransaction)}
          className="space-y-4"
        >
          <DialogHeader>
            <DialogTitle />
            <Controller
              name="transactionType"
              control={control}
              render={({ field }) => (
                <Tabs
                  value={field.value}
                  onValueChange={field.onChange}
                  className="items-center"
                >
                  <TabsList className="w-[80%] sm:w-1/2">
                    <TabsTrigger
                      className="text-green-600 hover:cursor-pointer"
                      value="incoming"
                    >
                      Entrada
                    </TabsTrigger>
                    <TabsTrigger
                      className="text-red-600 hover:cursor-pointer"
                      value="outcoming"
                    >
                      Saída
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              )}
            />
          </DialogHeader>
          <Column className="space-y-2">
            <Label htmlFor="transaction">Transação</Label>
            <Controller
              name="description"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <Column>
                  <Input
                    id="transaction"
                    placeholder="Salário"
                    value={value}
                    onChange={onChange}
                    className={`${error && "border-red-600"}`}
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
          <Flex className="min-[500px]:space-x-2 max-[500px]:flex-col max-[500px]:space-y-4">
            <Column className="space-y-2">
              <Label htmlFor="value">Valor</Label>
              <Controller
                name="value"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <Column>
                    <Input
                      id="value"
                      placeholder="R$ 2.000,00"
                      value={value}
                      onChange={onChange}
                      className={`${error && "border-red-600"}`}
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
            <Controller
              name="date"
              control={control}
              render={({ field: { value, onChange } }) => (
                <DatePicker
                  value={value}
                  onValueChange={(date) => onChange(date)}
                />
              )}
            />
          </Flex>
          <DialogFooter>
            <DialogClose asChild>
              <Button className="hover:cursor-pointer" variant="secondary">
                Cancelar
              </Button>
            </DialogClose>
            <Button
              className="hover:cursor-pointer"
              type="submit"
              disabled={pendingPostTransaction}
            >
              <Show when={pendingPostTransaction}>
                <Loader2Icon className="animate-spin" />
              </Show>
              Adicionar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionFormDialog;
